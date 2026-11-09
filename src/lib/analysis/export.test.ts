import { describe, expect, it } from "vitest";

import { CALCULATORS } from "@/lib/calculators/registry";
import type { AnalysisDTO } from "@/lib/analysis/types";
import { buildReport, buildReportHtml, canExport, escapeHtml } from "@/lib/analysis/export";

function makeEntry(overrides: Partial<AnalysisDTO> = {}): AnalysisDTO {
  const def = CALCULATORS[0];
  const values = Object.fromEntries(
    def.fields.map((f) => [f.key, f.defaultValue ?? f.options?.[0]?.value ?? "1"]),
  );
  const result = def.compute(values);
  return {
    id: "123e4567-e89b-42d3-a456-426614174000",
    fileName: "coa.pdf",
    mimeType: "application/pdf",
    storagePath: "u/coa.pdf",
    summary: null,
    suggestions: [],
    calculatorId: def.id,
    values,
    outputs: result.outputs,
    verdicts: result.verdicts,
    status: "reviewed",
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-02T11:30:00.000Z",
    ...overrides,
  };
}

const analyst = { name: "A. Analyst", email: "analyst@example.com" };

describe("run export", () => {
  it("only exports reviewed runs", () => {
    expect(canExport(makeEntry())).toBe(true);
    expect(canExport(makeEntry({ status: "analyzed" }))).toBe(false);
    expect(canExport(makeEntry({ outputs: null }))).toBe(false);
    expect(canExport(makeEntry({ calculatorId: "does-not-exist" }))).toBe(false);
    expect(buildReport(makeEntry({ status: "analyzed" }), analyst)).toBeNull();
  });

  it("includes an audit trail with analyst, source and timestamps", () => {
    const report = buildReport(makeEntry(), analyst)!;
    const audit = Object.fromEntries(report.audit);
    expect(audit["Analyst"]).toContain("analyst@example.com");
    expect(audit["Source document"]).toBe("coa.pdf");
    expect(audit["Report ID"]).toBe("123e4567-e89b-42d3-a456-426614174000");
    expect(audit["Reviewed and saved"]).toContain("2026-11-02T11:30:00.000Z");
    expect(report.fileBase).toMatch(/^[a-z0-9-_]+_123e4567_20261102$/i);
  });

  it("escapes HTML coming from document-derived text", () => {
    const entry = makeEntry({ fileName: '<img src=x onerror="alert(1)">.pdf' });
    const html = buildReportHtml(buildReport(entry, analyst)!);
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img src=x");
    expect(escapeHtml(`<a href="x">&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;");
  });
});
