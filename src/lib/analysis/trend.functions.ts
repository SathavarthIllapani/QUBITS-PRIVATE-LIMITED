/**
 * Server functions for the AI trend review over saved assay & potency runs.
 * Reviewed results the analyst selects are summarised by the model: trends,
 * unusual shifts and suggested follow-up checks — always for human review.
 */
import { Output, streamText } from "ai";
import { createServerFn } from "@tanstack/react-start";
import { jsonSchema } from "@ai-sdk/provider-utils";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { TREND_RATE_LIMITS, exceededRateLimit } from "@/lib/rate-limit.server";
import { createResponsesProvider, getAiApiKey, toUserSafeAiError } from "@/lib/ai/gateway.server";
import { CALCULATORS, type Verdict } from "@/lib/calculators/registry";
import { heuristicTrendReview } from "./heuristic.server";

import { TREND_CATEGORY, isTrendEligible } from "./trend-select";
import type {
  AnalysisDTO,
  TrendFlag,
  TrendReviewDTO,
  TrendReviewListResult,
  TrendReviewResult,
  TrendSeverity,
} from "./types";

const DEFAULT_MODEL = "gpt-4o-mini";
/** Trends need a chronology: at least two reviewed runs. */
const MIN_RUNS = 2;
const MAX_RUNS = 20;

const generateInput = z.object({
  ids: z.array(z.string().uuid()).min(MIN_RUNS).max(MAX_RUNS),
});

const deleteInput = z.object({ id: z.string().uuid() });

const trendJsonSchema = jsonSchema<{
  summary: string;
  flags: { calculatorId: string; metric: string; severity: string; detail: string }[];
  followUps: { title: string; detail: string }[];
}>({
  type: "object",
  properties: {
    summary: {
      type: "string",
      description:
        "Two to four sentences describing the trend across the selected assay & potency runs.",
    },
    flags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          calculatorId: { type: "string" },
          metric: { type: "string", description: "The value being commented on, e.g. 'Assay (as-is basis)' or 'RSD'." },
          severity: { type: "string", enum: ["normal", "watch", "unusual"] },
          detail: { type: "string", description: "One or two sentences grounded in the provided numbers only." },
        },
        required: ["calculatorId", "metric", "severity", "detail"],
        additionalProperties: false,
      },
    },
    followUps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short label of a concrete laboratory follow-up check." },
          detail: { type: "string", description: "What to do and which run(s) it concerns." },
        },
        required: ["title", "detail"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "flags", "followUps"],
  additionalProperties: false,
});

const SYSTEM_PROMPT = `You are the trend-review assistant for the Qubits lab calculator suite (Indian Pharmacopoeia QC calculations, IPC/GD/09).
You receive reviewed assay & potency results that pharma quality-control analysts calculated and saved earlier. Each run lists the calculator used, its inputs, the computed outputs and the verdicts already checked against the IPC acceptance limits.

Your job, strictly as decision support for a human analyst:
1. Summarise the trend across the runs (consistent, drifting, improving, worsening).
2. Flag unusual shifts and watch-level observations as individual flags.
3. Suggest concrete follow-up checks a human should perform before drawing any conclusion.

Severity rules:
- "unusual": a result outside its IPC acceptance limit, or an abrupt shift between consecutive runs.
- "watch": within limits but close to the edge, or a steady drift over the sequence.
- "normal": consistent with the other runs and comfortably inside limits.

Rules:
- Ground EVERY statement in the provided numbers only. Never invent, round or extrapolate values that are not listed.
- calculatorId must be one of the calculators used in the selected runs.
- Maximum 8 flags, most important first; do not repeat a flag for the same metric on the same run.
- Maximum 5 follow-ups, each a concrete laboratory action (e.g. repeat injection, re-weigh the sample, verify water content, recalibrate before the next batch) tied to the runs concerned.
- The output is an aid for human review, never an approval or rejection decision.`;

interface TrendRow {
  id: string;
  file_name: string;
  mime_type: string | null;
  storage_path: string;
  summary: string | null;
  suggestions: unknown;
  calculator_id: string | null;
  values: unknown;
  outputs: unknown;
  verdicts: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

function rowToDto(row: TrendRow): AnalysisDTO {
  const status: AnalysisDTO["status"] = row.status === "reviewed" ? "reviewed" : "analyzed";
  return {
    id: row.id,
    fileName: row.file_name,
    mimeType: row.mime_type,
    storagePath: row.storage_path,
    summary: row.summary,
    suggestions: Array.isArray(row.suggestions) ? (row.suggestions as never) : [],
    calculatorId: row.calculator_id,
    values: (row.values as Record<string, string> | null) ?? null,
    outputs: (row.outputs as Record<string, number | string | null> | null) ?? null,
    verdicts: (row.verdicts as Verdict[] | null) ?? null,
    status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function formatRun(entry: AnalysisDTO): string {
  const calc = CALCULATORS.find((c) => c.id === entry.calculatorId);
  const lines = [
    `run_id: ${entry.id}`,
    `document: ${entry.fileName}`,
    `calculator: ${calc?.title ?? entry.calculatorId} (${entry.calculatorId})`,
    `saved_at: ${entry.createdAt}`,
    `inputs: ${JSON.stringify(entry.values ?? {})}`,
    `outputs: ${JSON.stringify(entry.outputs ?? {})}`,
    `verdicts: ${JSON.stringify(
      (entry.verdicts ?? []).map((verdict) => `${verdict.status}: ${verdict.message}`),
    )}`,
  ];
  return lines.join("\n");
}

const SEVERITIES: TrendSeverity[] = ["normal", "watch", "unusual"];

function sanitizeReport(raw: unknown): { report: TrendReviewDTO["report"] | null } {
  if (raw == null || typeof raw !== "object") return { report: null };
  const value = raw as { summary?: unknown; flags?: unknown; followUps?: unknown };
  const flags: TrendFlag[] = Array.isArray(value.flags)
    ? value.flags
        .map((flag) => {
          if (flag == null || typeof flag !== "object") return null;
          const f = flag as { calculatorId?: unknown; metric?: unknown; severity?: unknown; detail?: unknown };
          if (typeof f.detail !== "string") return null;
          const severity = SEVERITIES.includes(f.severity as TrendSeverity)
            ? (f.severity as TrendSeverity)
            : "watch";
          return {
            calculatorId: typeof f.calculatorId === "string" ? f.calculatorId : "",
            metric: typeof f.metric === "string" ? f.metric : "Result",
            severity,
            detail: f.detail,
          };
        })
        .filter((flag): flag is TrendFlag => flag !== null)
    : [];
  const followUps = Array.isArray(value.followUps)
    ? value.followUps
        .map((item) => {
          if (item == null || typeof item !== "object") return null;
          const f = item as { title?: unknown; detail?: unknown };
          return typeof f.title === "string" && typeof f.detail === "string"
            ? { title: f.title, detail: f.detail }
            : null;
        })
        .filter((item): item is { title: string; detail: string } => item !== null)
    : [];
  return {
    report: {
      summary: typeof value.summary === "string" && value.summary.trim() ? value.summary.trim() : "Trend review complete.",
      flags: flags.slice(0, 8),
      followUps: followUps.slice(0, 5),
    },
  };
}

export const generateTrendReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => generateInput.parse(input))
  .handler(async ({ data, context }): Promise<TrendReviewResult> => {
    const limited = await exceededRateLimit(async (since) => {
      const { count, error: countError } = await context.supabase
        .from("trend_reviews")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since);
      return countError ? null : count;
    }, TREND_RATE_LIMITS);
    if (limited) return { ok: false, error: limited };

    const { data: rows, error } = await context.supabase
      .from("analyses")
      .select("*")
      .in("id", data.ids);
    if (error) {
      console.error("Failed to load runs for trend review:", error);
      return { ok: false, error: "Could not load the selected runs." };
    }

    const candidates = (rows ?? [])
      .map((row) => rowToDto(row as TrendRow))
      .filter(isTrendEligible)
      // Oldest first so the sequence is read in order.
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    if (candidates.length < MIN_RUNS) {
      return {
        ok: false,
        error: `A trend needs at least ${MIN_RUNS} reviewed assay & potency runs with saved results. Review and save more runs first.`,
      };
    }

    const usedIds = candidates.map((candidate) => candidate.id);
    const usedCalculators = [
      ...new Set(candidates.map((candidate) => candidate.calculatorId)),
    ];

    let report: TrendReviewDTO["report"] | null = null;
    const apiKey = getAiApiKey();

    if (apiKey) {
      try {
        const { model } = createResponsesProvider(DEFAULT_MODEL);
        const runText = candidates.map(formatRun).join("\n\n");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Review these ${candidates.length} saved assay & potency runs (oldest first):\n\n${runText}\n\nReturn the trend review as JSON. Use only these calculatorId values: ${usedCalculators.join(", ")}.`,
            },
          ],
          output: Output.object({ schema: trendJsonSchema }),
        });

        const parsed = await result.output;
        const sanitized = sanitizeReport(parsed);
        report = sanitized.report;
      } catch (aiError) {
        console.warn("AI trend review unavailable, using statistical heuristic review:", aiError);
        report = heuristicTrendReview(candidates);
      }
    } else {
      report = heuristicTrendReview(candidates);
    }

    if (!report) {
      return { ok: false, error: "The trend review could not be generated. Please try again." };
    }

    // Keep only flags that reference a calculator used in this review.
    const flags = report.flags.filter(
      (flag) => !flag.calculatorId || usedCalculators.includes(flag.calculatorId),
    );

    const { data: row, error: insertError } = await context.supabase
      .from("trend_reviews")
      .insert({
        analysis_ids: usedIds as never,
        report: { ...report, flags } as never,
      })
      .select()
      .single();

    if (insertError || !row) {
      console.error("Failed to save trend review:", insertError);
      return { ok: false, error: "The trend analysis worked but could not be saved to your history." };
    }

    const saved = row as { id: string; analysis_ids: string[]; report: unknown; created_at: string };
    const savedReport = sanitizeReport(saved.report).report ?? report;
    return {
      ok: true,
      review: {
        id: saved.id,
        analysisIds: Array.isArray(saved.analysis_ids) ? saved.analysis_ids : usedIds,
        report: savedReport,
        createdAt: saved.created_at,
      },
    };
  });

export const listTrendReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TrendReviewListResult> => {
    const { data, error } = await context.supabase
      .from("trend_reviews")
      .select("id, analysis_ids, report, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) {
      console.error("Failed to list trend reviews:", error);
      return { ok: false, reviews: [], error: "Could not load your trend reviews." };
    }
    const reviews: TrendReviewDTO[] = [];
    for (const row of data ?? []) {
      const saved = row as { id: string; analysis_ids: unknown; report: unknown; created_at: string };
      const { report } = sanitizeReport(saved.report);
      if (!report) continue;
      reviews.push({
        id: saved.id,
        analysisIds: Array.isArray(saved.analysis_ids) ? (saved.analysis_ids as string[]) : [],
        report,
        createdAt: saved.created_at,
      });
    }
    return { ok: true, reviews };
  });

export const deleteTrendReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => deleteInput.parse(input))
  .handler(async ({ data, context }): Promise<{ ok: boolean; error?: string }> => {
    const { error } = await context.supabase.from("trend_reviews").delete().eq("id", data.id);
    if (error) {
      console.error("Failed to delete trend review:", error);
      return { ok: false, error: "Could not delete this trend review." };
    }
    return { ok: true };
  });

export const TREND_LIMITS = { MIN_RUNS, MAX_RUNS } as const;
