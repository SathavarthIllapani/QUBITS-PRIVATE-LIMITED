/** Client-safe types shared between the analysis server functions and the UI. */
import type { Verdict } from "@/lib/calculators/registry";

export interface Suggestion {
  calculatorId: string;
  /** 0–1. */
  confidence: number;
  values: Record<string, string>;
  notes: string;
}

export interface AnalysisDTO {
  id: string;
  fileName: string;
  mimeType: string | null;
  storagePath: string;
  summary: string | null;
  suggestions: Suggestion[];
  calculatorId: string | null;
  values: Record<string, string> | null;
  outputs: Record<string, number | string | null> | null;
  verdicts: Verdict[] | null;
  status: "analyzed" | "reviewed";
  createdAt: string;
  updatedAt: string;
}

export type AnalyzeResult =
  | { ok: true; analysis: AnalysisDTO }
  | { ok: false; error: string };

export interface AnalysisListResult {
  ok: boolean;
  analyses: AnalysisDTO[];
  error?: string;
}

export interface SaveResult {
  ok: boolean;
  error?: string;
}

export const ACCEPTED_UPLOAD =
  ".pdf,.xlsx,.xls,.xlsm,.csv,.txt,.json,.md,.zip,.png,.jpg,.jpeg,.webp,.gif";
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const ANALYSIS_BUCKET = "analysis-documents";

/** Severity of an observation produced by the AI trend review. */
export type TrendSeverity = "normal" | "watch" | "unusual";

export interface TrendFlag {
  calculatorId: string;
  metric: string;
  severity: TrendSeverity;
  detail: string;
}

export interface TrendFollowUp {
  title: string;
  detail: string;
}

export interface TrendReport {
  summary: string;
  flags: TrendFlag[];
  followUps: TrendFollowUp[];
}

export interface TrendReviewDTO {
  id: string;
  analysisIds: string[];
  report: TrendReport;
  createdAt: string;
}

export type TrendReviewResult =
  | { ok: true; review: TrendReviewDTO }
  | { ok: false; error: string };

export interface TrendReviewListResult {
  ok: boolean;
  reviews: TrendReviewDTO[];
  error?: string;
}
