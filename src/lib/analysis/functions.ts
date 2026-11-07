/**
 * Server functions for the upload → extract → review → calculate workflow.
 * Every function requires an authenticated session; RLS scopes rows to the
 * caller's user_id.
 */
import { Output, streamText } from "ai";
import { createServerFn } from "@tanstack/react-start";
import { jsonSchema } from "@ai-sdk/provider-utils";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createResponsesProvider, getAiApiKey, toUserSafeAiError } from "@/lib/ai/gateway.server";
import { CALCULATORS } from "@/lib/calculators/registry";
import { extractDocument } from "@/lib/analysis/parse.server";
import { heuristicExtract } from "@/lib/analysis/heuristic.server";
import type {
  AnalysisDTO,
  AnalysisListResult,
  AnalyzeResult,
  SaveResult,
  Suggestion,
} from "@/lib/analysis/types";

const BUCKET = "analysis-documents";
const DEFAULT_MODEL = "gpt-4o-mini";

const analyzeInput = z.object({
  path: z.string().min(1),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().max(190).optional(),
});

const saveInput = z.object({
  id: z.string().uuid(),
  calculatorId: z.string().min(1),
  values: z.record(z.string(), z.string()),
  outputs: z.record(z.string(), z.union([z.number(), z.string(), z.null()])),
  verdicts: z.array(z.object({ status: z.enum(["pass", "fail", "warn", "info"]), message: z.string() })),
});

const deleteInput = z.object({ id: z.string().uuid() });

/** Strict-compatible wire schema for the structured extraction result. */
const extractionJsonSchema = jsonSchema<{
  summary: string;
  suggestions: {
    calculatorId: string;
    confidence: number;
    values: { key: string; value: string }[];
    notes: string;
  }[];
}>({
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "One or two sentences describing what the document(s) contain.",
    },
    suggestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          calculatorId: { type: "string" },
          confidence: { type: "number" },
          values: {
            type: "array",
            items: {
              type: "object",
              properties: { key: { type: "string" }, value: { type: "string" } },
              required: ["key", "value"],
              additionalProperties: false,
            },
          },
          notes: { type: "string" },
        },
        required: ["calculatorId", "confidence", "values", "notes"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "suggestions"],
  additionalProperties: false,
});

function buildCatalog(): string {
  return JSON.stringify(
    CALCULATORS.map((calc) => ({
      id: calc.id,
      category: calc.category,
      title: calc.title,
      formula: calc.formula,
      reference: calc.reference,
      fields: calc.fields.map((field) => ({
        key: field.key,
        label: field.label,
        type: field.type,
        unit: field.unit,
        help: field.help,
        options: field.options?.map((option) => option.value),
      })),
    })),
  );
}

const SYSTEM_PROMPT = `You are the data-extraction assistant for the Qubits lab calculator suite (Indian Pharmacopoeia QC calculations, IPC/GD/09).
You receive text and/or images extracted from documents uploaded by pharma quality-control staff: certificates of analysis, chromatography reports, weighing and preparation records, SOPs, spreadsheets or archives of these.

Your job:
1. Summarise what the document(s) contain.
2. Extract the concrete numeric values relevant to the listed calculators.
3. Suggest which calculator(s) the user most likely wants, mapping extracted values onto that calculator's fields.

Rules:
- Use ONLY the listed calculatorId values.
- Field keys ("key") must match the calculator's field keys exactly. For select fields, use exactly one of the listed option values.
- Include only values that are actually present in the document. Never invent, round or guess numbers.
- If the document is unrelated to these calculations, return an empty suggestions array and say so in the summary.
- Maximum 4 suggestions, most relevant first. confidence is 0-1.
- notes: one short sentence about what was found or which values are missing.

Return JSON matching the schema. The calculator catalog is:
${buildCatalog()}`;

interface AnalysisRow {
  id: string;
  user_id: string;
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

function toDto(row: AnalysisRow): AnalysisDTO {
  const status: AnalysisDTO["status"] = row.status === "reviewed" ? "reviewed" : "analyzed";
  return {
    id: row.id,
    fileName: row.file_name,
    mimeType: row.mime_type,
    storagePath: row.storage_path,
    summary: row.summary,
    suggestions: Array.isArray(row.suggestions) ? (row.suggestions as Suggestion[]) : [],
    calculatorId: row.calculator_id,
    values: (row.values as Record<string, string> | null) ?? null,
    outputs: (row.outputs as Record<string, number | string | null> | null) ?? null,
    verdicts: (row.verdicts as AnalysisDTO["verdicts"]) ?? null,
    status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const analyzeUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => analyzeInput.parse(input))
  .handler(async ({ data, context }): Promise<AnalyzeResult> => {
    const userId = context.userId;
    if (!userId || !data.path.startsWith(`${userId}/`)) {
      return { ok: false, error: "You can only analyse files you uploaded yourself." };
    }

    const { data: blob, error: downloadError } = await context.supabase.storage
      .from(BUCKET)
      .download(data.path);
    if (downloadError || !blob) {
      return { ok: false, error: "Could not read the uploaded file. Please try uploading it again." };
    }

    const bytes = new Uint8Array(await blob.arrayBuffer());
    const doc = await extractDocument(data.fileName, blob.type || data.mimeType || "", bytes);
    if (doc.parts.length === 0) {
      return {
        ok: false,
        error:
          "Nothing readable was found in this file. Supported: PDF, Excel, CSV, TXT, JSON, ZIP and images.",
      };
    }

    let summary = "Document analysed.";
    let suggestions: Suggestion[] = [];

    const apiKey = getAiApiKey();

    if (apiKey) {
      try {
        const { model } = createResponsesProvider(DEFAULT_MODEL);

        const messageContent: Array<
          | { type: "text"; text: string }
          | { type: "image"; image: string }
          | { type: "file"; filename: string; mediaType: "application/pdf"; data: string }
        > = [];

        for (const part of doc.parts) {
          if (part.kind === "text") {
            messageContent.push({ type: "text", text: `--- ${part.name} ---\n${part.text}` });
          } else if (part.kind === "image") {
            messageContent.push({ type: "image", image: part.dataUrl });
          } else {
            messageContent.push({
              type: "file",
              filename: part.name,
              mediaType: "application/pdf",
              data: part.base64,
            });
          }
        }
        for (const warning of doc.warnings) {
          messageContent.push({ type: "text", text: `[note: ${warning}]` });
        }

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: messageContent }],
          output: Output.object({ schema: extractionJsonSchema }),
        });

        const parsed = await result.output;
        suggestions = (parsed.suggestions ?? [])
          .map((suggestion) => ({
            calculatorId: suggestion.calculatorId,
            confidence: Math.max(0, Math.min(1, Number(suggestion.confidence) || 0)),
            values: Object.fromEntries(
              (suggestion.values ?? [])
                .filter((entry) => typeof entry?.key === "string" && typeof entry?.value === "string")
                .map((entry) => [entry.key, entry.value]),
            ),
            notes: typeof suggestion.notes === "string" ? suggestion.notes : "",
          }))
          .filter((suggestion) => CALCULATORS.some((calc) => calc.id === suggestion.calculatorId))
          .slice(0, 4);

        summary =
          typeof parsed.summary === "string" && parsed.summary.trim()
            ? parsed.summary.trim()
            : "Document analysed.";
      } catch (aiError) {
        console.warn("AI extraction unavailable, using heuristic extraction:", aiError);
        const fallback = heuristicExtract(doc, data.fileName);
        summary = fallback.summary;
        suggestions = fallback.suggestions;
      }
    } else {
      const fallback = heuristicExtract(doc, data.fileName);
      summary = fallback.summary;
      suggestions = fallback.suggestions;
    }

    try {
      const { data: row, error: insertError } = await context.supabase
        .from("analyses")
        .insert({
          user_id: userId,
          file_name: data.fileName,
          mime_type: blob.type || data.mimeType || null,
          storage_path: data.path,
          summary,
          suggestions: suggestions as never,
          status: "analyzed",
        })
        .select()
        .single();

      if (insertError || !row) {
        console.error("Failed to save analysis row:", insertError);
        return { ok: false, error: "The analysis worked but could not be saved to your history." };
      }
      return { ok: true, analysis: toDto(row as AnalysisRow) };
    } catch (error) {
      return { ok: false, error: toUserSafeAiError(error) };
    }
  });

export const listAnalyses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AnalysisListResult> => {
    const { data, error } = await context.supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      console.error("Failed to list analyses:", error);
      return { ok: false, analyses: [], error: "Could not load your history." };
    }
    return { ok: true, analyses: (data ?? []).map((row) => toDto(row as AnalysisRow)) };
  });

export const saveReviewedAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => saveInput.parse(input))
  .handler(async ({ data, context }): Promise<SaveResult> => {
    const { error } = await context.supabase
      .from("analyses")
      .update({
        calculator_id: data.calculatorId,
        values: data.values,
        outputs: data.outputs,
        verdicts: data.verdicts as never,
        status: "reviewed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) {
      console.error("Failed to save reviewed analysis:", error);
      return { ok: false, error: "Could not save to your history." };
    }
    return { ok: true };
  });

export const deleteAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => deleteInput.parse(input))
  .handler(async ({ data, context }): Promise<SaveResult> => {
    const { data: row } = await context.supabase
      .from("analyses")
      .select("storage_path")
      .eq("id", data.id)
      .single();
    const { error } = await context.supabase.from("analyses").delete().eq("id", data.id);
    if (error) {
      console.error("Failed to delete analysis:", error);
      return { ok: false, error: "Could not delete this history entry." };
    }
    if (row?.storage_path) {
      await context.supabase.storage.from(BUCKET).remove([row.storage_path]);
    }
    return { ok: true };
  });
