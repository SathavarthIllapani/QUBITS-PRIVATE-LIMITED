import { describe, expect, it } from "vitest";

import { isTrendEligible, selectTrendCandidates } from "./trend-select";
import type { AnalysisDTO } from "./types";

const entry = (overrides: Partial<AnalysisDTO>): AnalysisDTO => ({
  id: "11111111-1111-4111-8111-111111111111",
  fileName: "coa.pdf",
  mimeType: "application/pdf",
  storagePath: "user/coa.pdf",
  summary: "CoA",
  suggestions: [],
  calculatorId: "assay-as-is",
  values: { stdArea: "1000" },
  outputs: { assay: 99.5, reported: 99.5 },
  verdicts: [{ status: "pass", message: "Within limits" }],
  status: "reviewed",
  createdAt: "2026-11-01T00:00:00Z",
  updatedAt: "2026-11-01T00:00:00Z",
  ...overrides,
});

describe("trend review eligibility", () => {
  it("includes reviewed assay & potency runs with saved outputs", () => {
    expect(isTrendEligible(entry({}))).toBe(true);
  });

  it("excludes runs that were never reviewed", () => {
    expect(isTrendEligible(entry({ status: "analyzed" }))).toBe(false);
  });

  it("excludes dilution & preparation calculators", () => {
    expect(isTrendEligible(entry({ calculatorId: "serial-dilution" }))).toBe(false);
  });

  it("excludes runs without a chosen calculator", () => {
    expect(isTrendEligible(entry({ calculatorId: null }))).toBe(false);
  });

  it("excludes runs without saved results", () => {
    expect(isTrendEligible(entry({ outputs: null }))).toBe(false);
    expect(isTrendEligible(entry({ outputs: {} }))).toBe(false);
  });

  it("filters a mixed list down to the eligible runs", () => {
    const candidates = selectTrendCandidates([
      entry({ id: "22222222-2222-4222-8222-222222222222" }),
      entry({ id: "33333333-3333-4333-8333-333333333333", status: "analyzed" }),
      entry({ id: "44444444-4444-4444-8444-444444444444", calculatorId: "serial-dilution" }),
    ]);
    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "22222222-2222-4222-8222-222222222222",
    ]);
  });
});
