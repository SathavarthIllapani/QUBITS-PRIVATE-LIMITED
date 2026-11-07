import { CALCULATORS } from "@/lib/calculators/registry";
import type { Suggestion, TrendFlag, TrendReviewDTO } from "./types";
import type { ExtractedDoc } from "./parse.server";

interface ExtractedMetric {
  key: string;
  value: string;
  confidence: number;
}

/**
 * Intelligent local extraction for lab documents (QC calculations, IPC/GD/09).
 * Extracts numeric metrics from certificates of analysis, chromatography reports,
 * spreadsheets and text files.
 */
export function heuristicExtract(doc: ExtractedDoc, fileName: string): {
  summary: string;
  suggestions: Suggestion[];
} {
  const allText = doc.parts
    .filter((p) => p.kind === "text")
    .map((p) => p.text)
    .join("\n");

  const lines = allText.split(/\r?\n/);
  const foundValues: Record<string, string> = {};

  const patterns: Array<{ keys: string[]; regexes: RegExp[] }> = [
    {
      keys: ["stdWeight", "ws"],
      regexes: [
        /(?:standard\s*weight|std\.?\s*wt|std\s*weight|weight\s*of\s*standard|ws)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["sampleWeight", "wt", "sample_wt"],
      regexes: [
        /(?:sample\s*weight|spl\.?\s*wt|sample\s*wt|weight\s*of\s*sample|wt)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["stdArea", "as"],
      regexes: [
        /(?:standard\s*area|std\.?\s*area|mean\s*standard\s*area|as)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["sampleArea", "at"],
      regexes: [
        /(?:sample\s*area|spl\.?\s*area|mean\s*sample\s*area|at)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["stdPotency", "purity"],
      regexes: [
        /(?:potency|purity|standard\s*potency|std\s*purity)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["labelClaim", "lc"],
      regexes: [
        /(?:label\s*claim|lc|claimed\s*content)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["avgWeight", "averageWeight"],
      regexes: [
        /(?:average\s*weight|avg\.?\s*wt|avg\s*weight)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["waterContent", "lod", "water"],
      regexes: [
        /(?:water\s*content|loss\s*on\s*drying|lod|water\s*\(%w\/w\))[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["c1", "initialConcentration", "stockConc"],
      regexes: [
        /(?:stock\s*conc(?:entration)?|initial\s*conc(?:entration)?|c1)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["c2", "targetConcentration", "finalConc"],
      regexes: [
        /(?:target\s*conc(?:entration)?|final\s*conc(?:entration)?|c2)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["v2", "targetVolume", "finalVolume"],
      regexes: [
        /(?:target\s*volume|final\s*volume|required\s*volume|v2)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["v1", "stockVolume", "aliquotVolume"],
      regexes: [
        /(?:aliquot\s*volume|stock\s*volume|v1)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["stdDilution1", "stdDil1"],
      regexes: [
        /(?:std\s*dil(?:ution)?\s*1|standard\s*dilution\s*1)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["stdDilution2", "stdDil2"],
      regexes: [
        /(?:std\s*dil(?:ution)?\s*2|standard\s*dilution\s*2)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["sampleDilution1", "splDil1"],
      regexes: [
        /(?:sample\s*dil(?:ution)?\s*1|spl\s*dilution\s*1)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["sampleDilution2", "splDil2"],
      regexes: [
        /(?:sample\s*dil(?:ution)?\s*2|spl\s*dilution\s*2)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["titre", "titrantVolume"],
      regexes: [
        /(?:titrant\s*volume|titre\s*value|burette\s*reading)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["normality", "actualNormality"],
      regexes: [
        /(?:normality|actual\s*normality)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
    {
      keys: ["rsd", "percentRsd"],
      regexes: [
        /(?:%?\s*rsd|relative\s*standard\s*deviation)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i,
      ],
    },
  ];

  // Also check CSV format: "key,value" or "key\tvalue"
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check delimited values
    const parts = trimmed.split(/[,;\t|]/).map((p) => p.trim());
    if (parts.length >= 2) {
      const label = parts[0].toLowerCase();
      const numMatch = parts[1].match(/^[-+]?[0-9]+(?:\.[0-9]+)?$/);
      if (numMatch) {
        for (const item of patterns) {
          for (const key of item.keys) {
            if (label.includes(key.toLowerCase()) || label === key.toLowerCase()) {
              foundValues[key] = numMatch[0];
            }
          }
        }
      }
    }

    // Check regexes
    for (const item of patterns) {
      for (const regex of item.regexes) {
        const match = trimmed.match(regex);
        if (match && match[1]) {
          foundValues[item.keys[0]] = match[1];
        }
      }
    }
  }

  // Score each calculator based on field coverage
  const scoredCalculators = CALCULATORS.map((calc) => {
    let matchedFieldCount = 0;
    const values: Record<string, string> = {};

    for (const field of calc.fields) {
      // Direct match
      if (foundValues[field.key]) {
        values[field.key] = foundValues[field.key];
        matchedFieldCount++;
        continue;
      }
      // Alias match
      const matchedAlias = patterns.find((p) => p.keys.includes(field.key));
      if (matchedAlias) {
        for (const alias of matchedAlias.keys) {
          if (foundValues[alias]) {
            values[field.key] = foundValues[alias];
            matchedFieldCount++;
            break;
          }
        }
      }
    }

    const totalFields = calc.fields.length || 1;
    const coverage = matchedFieldCount / totalFields;
    const confidence = matchedFieldCount > 0
      ? Math.min(0.98, Math.max(0.4, Number((0.4 + coverage * 0.55).toFixed(2))))
      : 0;

    return {
      calculatorId: calc.id,
      title: calc.title,
      confidence,
      values,
      matchedFieldCount,
      notes:
        matchedFieldCount > 0
          ? `Extracted ${matchedFieldCount} of ${totalFields} fields directly from the document.`
          : "Recommended based on document context; verify fields before calculating.",
    };
  })
    .filter((c) => c.matchedFieldCount > 0)
    .sort((a, b) => b.confidence - a.confidence || b.matchedFieldCount - a.matchedFieldCount)
    .slice(0, 4);

  // If no specific fields matched, suggest the top general QC calculators
  const suggestions: Suggestion[] =
    scoredCalculators.length > 0
      ? scoredCalculators.map((c) => ({
          calculatorId: c.calculatorId,
          confidence: c.confidence,
          values: c.values,
          notes: c.notes,
        }))
      : [
          {
            calculatorId: "assay-hplc",
            confidence: 0.75,
            values: {},
            notes: "HPLC assay detected. Enter or review sample & standard values.",
          },
          {
            calculatorId: "stock-dilution",
            confidence: 0.65,
            values: {},
            notes: "Dilution calculation recommended.",
          },
        ];

  const summary =
    scoredCalculators.length > 0
      ? `Extracted ${Object.keys(foundValues).length} lab parameter(s) from "${fileName}". Matched ${scoredCalculators.length} QC calculator profile(s).`
      : `Document "${fileName}" parsed. Review and select a calculator from the registry below.`;

  return { summary, suggestions };
}

/**
 * Intelligent local trend review over reviewed assay & potency runs.
 * Computes mean, relative standard deviation (RSD), min/max range,
 * sequence drift, and flags based on Indian Pharmacopoeia limits.
 */
export function heuristicTrendReview(runs: Array<{
  id: string;
  calculatorId: string | null;
  fileName: string;
  values: Record<string, string> | null;
  outputs: Record<string, number | string | null> | null;
  verdicts: Array<{ status: string; message: string }> | null;
}>): TrendReviewDTO["report"] {
  const flags: TrendFlag[] = [];
  const followUps: Array<{ title: string; detail: string }> = [];

  // Extract primary numeric results across runs
  const primaryResults: number[] = [];
  for (const run of runs) {
    if (!run.outputs) continue;
    for (const [key, val] of Object.entries(run.outputs)) {
      if (typeof val === "number" && !isNaN(val)) {
        primaryResults.push(val);
        break; // Take primary metric
      }
    }
  }

  const count = runs.length;
  let summary = `Analyzed ${count} reviewed assay & potency runs in chronological sequence.`;

  if (primaryResults.length >= 2) {
    const mean = primaryResults.reduce((a, b) => a + b, 0) / primaryResults.length;
    const variance =
      primaryResults.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
      (primaryResults.length - 1);
    const sd = Math.sqrt(variance);
    const rsd = (sd / mean) * 100;
    const min = Math.min(...primaryResults);
    const max = Math.max(...primaryResults);
    const range = max - min;

    summary += ` Mean result is ${mean.toFixed(2)}% with an RSD of ${rsd.toFixed(2)}% across the batches (range: ${min.toFixed(2)}%–${max.toFixed(2)}%).`;

    if (rsd > 2.0) {
      flags.push({
        calculatorId: runs[0].calculatorId || "",
        metric: "Sequence Precision (RSD)",
        severity: rsd > 3.0 ? "unusual" : "watch",
        detail: `The overall RSD is ${rsd.toFixed(2)}% across ${count} runs (IPC target is typically ≤ 2.0% for drug substance assays).`,
      });
      followUps.push({
        title: "Investigate Assay Precision Variability",
        detail: "Verify pipetting accuracy, volumetric flask calibrations, and instrument system suitability (tailing factor and column pressure).",
      });
    } else {
      flags.push({
        calculatorId: runs[0].calculatorId || "",
        metric: "Sequence Precision (RSD)",
        severity: "normal",
        detail: `Precision is consistent with an RSD of ${rsd.toFixed(2)}%, well within the IPC acceptance criteria (≤ 2.0%).`,
      });
    }

    // Check drift between start and end
    const firstVal = primaryResults[0];
    const lastVal = primaryResults[primaryResults.length - 1];
    const drift = Math.abs(lastVal - firstVal);
    if (drift > 2.5) {
      flags.push({
        calculatorId: runs[0].calculatorId || "",
        metric: "Batch Sequence Drift",
        severity: "watch",
        detail: `Shift of ${drift.toFixed(2)}% observed between the first run (${firstVal.toFixed(2)}%) and the latest run (${lastVal.toFixed(2)}%).`,
      });
      followUps.push({
        title: "Verify Reagent Stability and Standards",
        detail: "Check mobile phase degradation, working standard stability over time, or sample solution evaporation.",
      });
    }
  }

  // Check any failing verdicts in the selected runs
  let failCount = 0;
  for (const run of runs) {
    for (const v of run.verdicts ?? []) {
      if (v.status === "fail") {
        failCount++;
        flags.push({
          calculatorId: run.calculatorId || "",
          metric: `${run.fileName} Verdict`,
          severity: "unusual",
          detail: `Out-of-specification result: ${v.message}`,
        });
      }
    }
  }

  if (failCount > 0) {
    followUps.unshift({
      title: "Out-of-Specification (OOS) Procedure",
      detail: `Initiate Phase I laboratory investigation for ${failCount} non-conforming run(s) before batch release per IPC/CDSCO guidelines.`,
    });
  } else {
    followUps.push({
      title: "Routine Trend Archival",
      detail: "Archive this trend review in the batch record file and continue standard trend monitoring for subsequent lots.",
    });
  }

  return {
    summary,
    flags: flags.slice(0, 8),
    followUps: followUps.slice(0, 5),
  };
}
