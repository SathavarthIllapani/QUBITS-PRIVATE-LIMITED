/**
 * Client-safe selection rules for the AI trend review.
 * Only reviewed assay & potency runs with saved results are eligible:
 * dilution & preparation runs and unreviewed drafts never enter a trend.
 */
import { CALCULATORS, type CalculatorCategory } from "@/lib/calculators/registry";

import type { AnalysisDTO } from "./types";

export const TREND_CATEGORY: CalculatorCategory = "assay-potency";

export function isTrendEligible(entry: AnalysisDTO): boolean {
  if (entry.status !== "reviewed") return false;
  const def = CALCULATORS.find((calc) => calc.id === entry.calculatorId);
  if (!def || def.category !== TREND_CATEGORY) return false;
  if (!entry.values || !entry.outputs) return false;
  return Object.keys(entry.outputs).length > 0;
}

export function selectTrendCandidates(entries: AnalysisDTO[]): AnalysisDTO[] {
  return entries.filter(isTrendEligible);
}
