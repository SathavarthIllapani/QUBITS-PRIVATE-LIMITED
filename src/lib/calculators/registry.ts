/**
 * Config-driven calculator registry for the Qubits lab tool.
 *
 * Every formula from the IPC guidance document (IPC/GD/09, Indian
 * Pharmacopoeia Reference Substances) is a data entry in CALCULATORS.
 * Adding a new formula means adding one entry here — the UI renders any
 * definition automatically, so the tool scales without new components.
 * All math runs synchronously and is memoised per keystroke in the UI.
 */

export type CalculatorCategory = "assay-potency" | "dilution-preparation";

export type FieldType = "number" | "text" | "select";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  unit?: string;
  help?: string;
  placeholder?: string;
  defaultValue?: string;
  /** For select fields. */
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface OutputDef {
  key: string;
  label: string;
  unit?: string;
  decimals?: number;
  /** Highlighted as the headline result. */
  primary?: boolean;
  /** Rendered as copyable multi-line text instead of a number. */
  multiline?: boolean;
}

export interface Verdict {
  status: "pass" | "fail" | "warn" | "info";
  message: string;
}

export interface CalcResult {
  outputs: Record<string, number | string | null>;
  verdicts: Verdict[];
}

export interface CalculatorDef {
  id: string;
  category: CalculatorCategory;
  title: string;
  summary: string;
  /** Human-readable formula, shown under the title. */
  formula?: string;
  /** Clause in IPC/GD/09 the calculation comes from. */
  reference: string;
  fields: FieldDef[];
  outputs: OutputDef[];
  compute: (values: Record<string, string>) => CalcResult;
}

export const CATEGORY_META: Record<
  CalculatorCategory,
  { label: string; blurb: string }
> = {
  "assay-potency": {
    label: "Assay & Potency",
    blurb:
      "Chromatographic assay of working standards against an IPRS, correlation checks, RSD limits and potency assignment.",
  },
  "dilution-preparation": {
    label: "Dilution & Preparation",
    blurb:
      "Solution weighing, serial dilutions, vial subdivision and the standard injection sequence for working-standard qualification.",
  },
};

/* ---------------------------------- helpers ---------------------------------- */

const MISSING = "__missing__";

function toNumber(raw: string | undefined): number | null {
  if (raw === undefined || raw.trim() === "") return null;
  const n = Number(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function allNumbers<T extends string>(values: Record<string, string>, keys: readonly T[]): {
  values: Record<T, number>;
  missing: string[];
} {
  const out = {} as Record<T, number>;
  const missing: string[] = [];
  for (const key of keys) {
    const n = toNumber(values[key]);
    if (n === null) missing.push(key);
    else out[key] = n;
  }
  return { values: out, missing };
}

function round(n: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

function fmt(n: number | null, decimals = 2): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return n.toFixed(decimals);
}

function parseSeries(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map((token) => Number(token.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n));
}

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function sampleSd(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance =
    values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function rsdPercent(values: number[]): number | null {
  if (values.length < 2) return null;
  const m = mean(values);
  if (m === 0) return null;
  return (sampleSd(values) / Math.abs(m)) * 100;
}

const noResult = (verdicts: Verdict[] = []): CalcResult => ({
  outputs: {},
  verdicts,
});

/* --------------------------------- calculators --------------------------------- */

const assayAsIs: CalculatorDef = {
  id: "assay-as-is",
  category: "assay-potency",
  title: "Assay, % w/w (as-is basis)",
  summary:
    "Chromatographic assay of the working standard against the primary standard, calculated on an as-is basis.",
  formula:
    "Assay = (Test area × Wt. std × Test dilution × Purity std) ÷ (Std area × Std dilution × Wt. test)",
  reference: "IPC/GD/09 — step (ix)",
  fields: [
    { key: "stdArea", label: "Average standard area", type: "number", help: "Mean area response of standard preparations 1 and 2." },
    { key: "stdWt", label: "Weight of standard", type: "number", unit: "mg", step: 0.001 },
    { key: "stdDil", label: "Standard dilution", type: "number", unit: "mL", help: "Final volume of the standard preparation." },
    { key: "stdPurity", label: "Purity of standard", type: "number", unit: "%", step: 0.01, help: "Certified potency of the IPRS, e.g. 99.5." },
    { key: "testArea", label: "Average test area", type: "number", help: "Mean area response of sample preparations 1–3." },
    { key: "testWt", label: "Weight of test sample", type: "number", unit: "mg", step: 0.001 },
    { key: "testDil", label: "Test dilution", type: "number", unit: "mL" },
  ],
  outputs: [
    { key: "assay", label: "Assay (as-is basis)", unit: "% w/w", decimals: 2, primary: true },
    { key: "reported", label: "Reported assay", unit: "% w/w", decimals: 2 },
  ],
  compute(values) {
    const { values: v, missing } = allNumbers(values, [
      "stdArea", "stdWt", "stdDil", "stdPurity", "testArea", "testWt", "testDil",
    ]);
    if (missing.length > 0) return noResult();
    if (v.stdArea <= 0 || v.stdWt <= 0 || v.stdDil <= 0 || v.testWt <= 0 || v.testDil <= 0) {
      return noResult([
        { status: "fail", message: "Weights, dilutions and standard area must be greater than zero." },
      ]);
    }
    const assay =
      (v.testArea * v.stdWt * v.testDil * (v.stdPurity / 100)) /
      (v.stdArea * v.stdDil * v.testWt) * 100;
    const capped = assay > 100;
    const reported = capped ? 100 : assay;
    return {
      outputs: { assay: round(assay, 2), reported: round(reported, 2) },
      verdicts: capped
        ? [
            {
              status: "warn",
              message:
                "Assay above 100.0% w/w — consider and report it as 100.0% w/w (IPC/GD/09 step xii; other than biological standards).",
            },
          ]
        : [
            {
              status: "pass",
              message: "Assay within reportable range — value can be used as-is.",
            },
          ],
    };
  },
};

const assayDriedBasis: CalculatorDef = {
  id: "assay-dried-basis",
  category: "assay-potency",
  title: "Assay on dried / anhydrous basis",
  summary:
    "Converts the as-is assay to dried or anhydrous basis using water content or loss on drying.",
  formula: "Assay (dried) = Assay (as-is) × 100 ÷ (100 − Water content / LOD)",
  reference: "IPC/GD/09 — page 7",
  fields: [
    { key: "assayAsIs", label: "Assay (as-is basis)", type: "number", unit: "% w/w", step: 0.01 },
    { key: "water", label: "Water content / LOD", type: "number", unit: "%", step: 0.01, help: "Karl Fischer water content or loss on drying." },
  ],
  outputs: [
    { key: "assayDried", label: "Assay (dried/anhydrous basis)", unit: "% w/w", decimals: 2, primary: true },
  ],
  compute(values) {
    const { values: v, missing } = allNumbers(values, ["assayAsIs", "water"]);
    if (missing.length > 0) return noResult();
    if (v.water >= 100) {
      return noResult([
        { status: "fail", message: "Water content / LOD must be below 100% to convert the assay." },
      ]);
    }
    const dried = (v.assayAsIs * 100) / (100 - v.water);
    return {
      outputs: { assayDried: round(dried, 2) },
      verdicts: [
        {
          status: "info",
          message:
            "Basis conversion applied. Use this value when the specification is expressed on a dried or anhydrous basis.",
        },
      ],
    };
  },
};

const correlation: CalculatorDef = {
  id: "correlation",
  category: "assay-potency",
  title: "Correlation of standard preparations 1 & 2",
  summary:
    "Checks the response correlation between the two standard preparations before sample analysis.",
  formula:
    "Correlation = (Avg area S1 ÷ Avg area S2) × (Wt. S2 ÷ Wt. S1) × 100",
  reference: "IPC/GD/09 — step (vii)",
  fields: [
    { key: "areaS1", label: "Average area — Standard-1", type: "number", step: 0.001 },
    { key: "areaS2", label: "Average area — Standard-2", type: "number", step: 0.001 },
    { key: "wtS1", label: "Weight — Standard-1", type: "number", unit: "mg", step: 0.001 },
    { key: "wtS2", label: "Weight — Standard-2", type: "number", unit: "mg", step: 0.001 },
  ],
  outputs: [
    { key: "correlation", label: "Correlation", unit: "%", decimals: 2, primary: true },
  ],
  compute(values) {
    const { values: v, missing } = allNumbers(values, ["areaS1", "areaS2", "wtS1", "wtS2"]);
    if (missing.length > 0) return noResult();
    if (v.areaS2 <= 0 || v.wtS1 <= 0) {
      return noResult([
        { status: "fail", message: "Standard-2 area and Standard-1 weight must be greater than zero." },
      ]);
    }
    const correlation = (v.areaS1 / v.areaS2) * (v.wtS2 / v.wtS1) * 100;
    const inRange = correlation >= 99.0 && correlation <= 101.0;
    return {
      outputs: { correlation: round(correlation, 2) },
      verdicts: [
        inRange
          ? { status: "pass", message: "Correlation within 99.0–101.0% — proceed with the test samples." }
          : {
              status: "fail",
              message:
                "Correlation outside 99.0–101.0% — do not proceed with the samples. Retest after root cause investigation (IPC/GD/09 step viii).",
            },
      ],
    };
  },
};

const rsdCalculator: CalculatorDef = {
  id: "rsd",
  category: "assay-potency",
  title: "% RSD of replicate results",
  summary:
    "Relative standard deviation of replicate injections or assay results against the IPC acceptance limits.",
  formula: "% RSD = SD ÷ mean × 100",
  reference: "IPC/GD/09 — step (xi)",
  fields: [
    {
      key: "series",
      label: "Replicate values",
      type: "text",
      placeholder: "e.g. 1023456, 1019823, 1025147",
      help: "Area responses or assay results, separated by commas or spaces.",
    },
    {
      key: "testType",
      label: "Test type",
      type: "select",
      defaultValue: "assay",
      options: [
        { value: "assay", label: "Assay (chromatographic) — NMT 1.0%" },
        { value: "overall", label: "Overall (replicate + bracketing std injections) — NMT 2.0%" },
        { value: "micro", label: "Assay by microbiological method — NMT 5.0%" },
      ],
    },
  ],
  outputs: [
    { key: "mean", label: "Mean", decimals: 2 },
    { key: "sd", label: "Standard deviation", decimals: 3 },
    { key: "rsd", label: "% RSD", decimals: 2, primary: true },
  ],
  compute(values) {
    const series = parseSeries(values["series"]);
    if (series.length < 2) {
      return noResult([
        { status: "info", message: "Enter at least two replicate values to compute an RSD." },
      ]);
    }
    const rsd = rsdPercent(series);
    if (rsd === null) return noResult();
    const limit =
      values["testType"] === "overall" ? 2.0 : values["testType"] === "micro" ? 5.0 : 1.0;
    return {
      outputs: {
        mean: round(mean(series), 2),
        sd: round(sampleSd(series), 3),
        rsd: round(rsd, 2),
      },
      verdicts: [
        rsd <= limit
          ? { status: "pass", message: `RSD ${fmt(rsd, 2)}% is within the NMT ${fmt(limit, 1)}% limit.` }
          : {
              status: "fail",
              message: `RSD ${fmt(rsd, 2)}% exceeds the NMT ${fmt(limit, 1)}% limit for this test type.`,
            },
      ],
    };
  },
};

const potencyAssignment: CalculatorDef = {
  id: "potency-assignment",
  category: "assay-potency",
  title: "Potency assignment (triplicate assay)",
  summary:
    "Assigns the working-standard potency from the mean of triplicate assays, with the 100% cap rule.",
  formula: "Assigned potency = mean of triplicate assay results",
  reference: "IPC/GD/09 — steps (x) and (xii)",
  fields: [
    { key: "r1", label: "Assay result 1", type: "number", unit: "% w/w", step: 0.01 },
    { key: "r2", label: "Assay result 2", type: "number", unit: "% w/w", step: 0.01 },
    { key: "r3", label: "Assay result 3", type: "number", unit: "% w/w", step: 0.01 },
    {
      key: "materialType",
      label: "Material type",
      type: "select",
      defaultValue: "chemical",
      options: [
        { value: "chemical", label: "Chemical (non-biological) standard" },
        { value: "biological", label: "Biological standard" },
      ],
    },
  ],
  outputs: [
    { key: "meanAssay", label: "Mean assay", unit: "% w/w", decimals: 2 },
    { key: "rsd", label: "Triplicate % RSD", decimals: 2 },
    { key: "potency", label: "Assigned potency", unit: "% w/w", decimals: 2, primary: true },
  ],
  compute(values) {
    const { values: v, missing } = allNumbers(values, ["r1", "r2", "r3"]);
    if (missing.length > 0) return noResult();
    const series = [v.r1, v.r2, v.r3];
    const m = mean(series);
    const rsd = rsdPercent(series) ?? 0;
    const isBiological = values["materialType"] === "biological";
    const capped = !isBiological && m > 100;
    const potency = capped ? 100 : m;
    const verdicts: Verdict[] = [
      rsd <= 1.0
        ? { status: "pass", message: `Triplicate RSD ${fmt(rsd, 2)}% meets the assay NMT 1.0% limit.` }
        : { status: "fail", message: `Triplicate RSD ${fmt(rsd, 2)}% exceeds the assay NMT 1.0% limit — repeat the assay.` },
    ];
    if (capped) {
      verdicts.push({
        status: "warn",
        message: "Mean above 100.0% w/w — assign and report 100.0% w/w (other than biological standards).",
      });
    }
    return {
      outputs: {
        meanAssay: round(m, 2),
        rsd: round(rsd, 2),
        potency: round(potency, 2),
      },
      verdicts,
    };
  },
};

const solutionWeighing: CalculatorDef = {
  id: "solution-weighing",
  category: "dilution-preparation",
  title: "Weight to weigh for target concentration",
  summary:
    "Quantity of working standard to weigh so the prepared solution hits the target concentration, corrected for assay.",
  formula: "Wt (mg) = Target conc (mg/mL) × Volume (mL) × 100 ÷ Assay (%)",
  reference: "IPC/GD/09 — working-standard preparation",
  fields: [
    { key: "conc", label: "Target concentration", type: "number", unit: "mg/mL", step: 0.001 },
    { key: "volume", label: "Final volume", type: "number", unit: "mL", step: 0.1 },
    { key: "assay", label: "Assay / potency of standard", type: "number", unit: "%", step: 0.01, help: "Use the assigned potency on the relevant basis." },
  ],
  outputs: [
    { key: "weightMg", label: "Weight to weigh", unit: "mg", decimals: 2, primary: true },
    { key: "weightG", label: "Weight to weigh", unit: "g", decimals: 4 },
  ],
  compute(values) {
    const { values: v, missing } = allNumbers(values, ["conc", "volume", "assay"]);
    if (missing.length > 0) return noResult();
    if (v.volume <= 0 || v.assay <= 0) {
      return noResult([
        { status: "fail", message: "Volume and assay must be greater than zero." },
      ]);
    }
    const mg = (v.conc * v.volume * 100) / v.assay;
    return {
      outputs: { weightMg: round(mg, 2), weightG: round(mg / 1000, 4) },
      verdicts: [
        {
          status: "info",
          message:
            "Weigh on butter paper by gentle tapping; never return excess material to the vial (IPC/GD/09 usage and handling).",
        },
      ],
    };
  },
};

const serialDilution: CalculatorDef = {
  id: "serial-dilution",
  category: "dilution-preparation",
  title: "Serial dilution (C₁V₁ = C₂V₂)",
  summary:
    "Volume of stock solution and diluent needed to reach a lower target concentration.",
  formula: "V₁ = C₂ × V₂ ÷ C₁",
  reference: "General dilution practice",
  fields: [
    { key: "c1", label: "Stock concentration (C₁)", type: "number", unit: "mg/mL", step: 0.001 },
    { key: "c2", label: "Target concentration (C₂)", type: "number", unit: "mg/mL", step: 0.001 },
    { key: "v2", label: "Final volume (V₂)", type: "number", unit: "mL", step: 0.1 },
  ],
  outputs: [
    { key: "v1", label: "Aliquot of stock (V₁)", unit: "mL", decimals: 3, primary: true },
    { key: "diluent", label: "Diluent to add", unit: "mL", decimals: 3 },
  ],
  compute(values) {
    const { values: v, missing } = allNumbers(values, ["c1", "c2", "v2"]);
    if (missing.length > 0) return noResult();
    if (v.c1 <= 0 || v.v2 <= 0) {
      return noResult([{ status: "fail", message: "Stock concentration and final volume must be greater than zero." }]);
    }
    if (v.c2 > v.c1) {
      return noResult([
        { status: "fail", message: "Target concentration cannot exceed the stock concentration — prepare a stronger stock instead." },
      ]);
    }
    const v1 = (v.c2 * v.v2) / v.c1;
    return {
      outputs: { v1: round(v1, 3), diluent: round(v.v2 - v1, 3) },
      verdicts: [
        { status: "pass", message: "Take the aliquot, then make up to final volume with diluent." },
      ],
    };
  },
};

const vialSubdivision: CalculatorDef = {
  id: "vial-subdivision",
  category: "dilution-preparation",
  title: "Working-standard vial subdivision",
  summary:
    "Splits an approved working-standard batch into labelled vials and checks the assigned validity.",
  formula: "Vials = ⌈Total quantity ÷ Quantity per vial⌉",
  reference: "IPC/GD/09 — step (xiii) and validity section",
  fields: [
    { key: "totalQty", label: "Total batch quantity", type: "number", unit: "g", step: 0.1 },
    { key: "perVial", label: "Quantity per vial", type: "number", unit: "g", step: 0.1, defaultValue: "1" },
    { key: "validityMonths", label: "Assigned validity", type: "number", unit: "months", defaultValue: "12" },
  ],
  outputs: [
    { key: "vials", label: "Number of vials", decimals: 0, primary: true },
    { key: "monthsCovered", label: "Months of use (1 vial / month)", unit: "months", decimals: 0 },
  ],
  compute(values) {
    const { values: v, missing } = allNumbers(values, ["totalQty", "perVial", "validityMonths"]);
    if (missing.length > 0) return noResult();
    if (v.perVial <= 0) {
      return noResult([{ status: "fail", message: "Quantity per vial must be greater than zero." }]);
    }
    const vials = Math.ceil(v.totalQty / v.perVial);
    const verdicts: Verdict[] = [];
    if (v.validityMonths > 12) {
      verdicts.push({
        status: "fail",
        message: "Validity exceeds twelve months — working standards are assigned up to 12 months, extendable only after review.",
      });
    } else {
      verdicts.push({
        status: "pass",
        message: "Validity within the recommended twelve months. Prepare or re-validate a new standard before it ends.",
      });
    }
    verdicts.push({
      status: "info",
      message: "In any case, an opened vial should not be used beyond one month (IPC/GD/09).",
    });
    return {
      outputs: { vials, monthsCovered: Math.min(vials, v.validityMonths) },
      verdicts,
    };
  },
};

const injectionSequence: CalculatorDef = {
  id: "injection-sequence",
  category: "dilution-preparation",
  title: "Standard injection sequence",
  summary:
    "Generates the typical injection sequence for system suitability, correlation and assay of a working standard.",
  reference: "IPC/GD/09 — step (vi)",
  fields: [
    {
      key: "samples",
      label: "Number of sample preparations",
      type: "number",
      min: 1,
      max: 6,
      step: 1,
      defaultValue: "3",
    },
    {
      key: "systemSuitability",
      label: "Include system suitability injection",
      type: "select",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
  ],
  outputs: [
    { key: "total", label: "Total injections", decimals: 0 },
    { key: "sequence", label: "Sequence", multiline: true, primary: true },
  ],
  compute(values) {
    const { values: v, missing } = allNumbers(values, ["samples"]);
    if (missing.length > 0) return noResult();
    if (v.samples < 1 || v.samples > 6 || !Number.isInteger(v.samples)) {
      return noResult([{ status: "fail", message: "Enter a whole number of sample preparations between 1 and 6." }]);
    }
    const lines: string[] = [];
    let total = 0;
    const push = (label: string, count: number) => {
      lines.push(`${lines.length + 1}. ${label} — ${count} injection${count > 1 ? "s" : ""}`);
      total += count;
    };
    push("Blank", 1);
    if (values["systemSuitability"] !== "no") push("System suitability (if required)", 1);
    push("Standard-1", 5);
    push("Standard-2", 2);
    for (let i = 1; i <= v.samples; i++) push(`Sample-${i}`, 2);
    push("Bracketing standard", 1);
    return {
      outputs: { total, sequence: lines.join("\n") },
      verdicts: [
        {
          status: "info",
          message:
            "Verify correlation between Standard-1 and Standard-2 and overall % RSD before reading the sample preparations.",
        },
      ],
    };
  },
};

/* ---------------------------------- registry ---------------------------------- */

export const CALCULATORS: CalculatorDef[] = [
  assayAsIs,
  assayDriedBasis,
  correlation,
  rsdCalculator,
  potencyAssignment,
  solutionWeighing,
  serialDilution,
  vialSubdivision,
  injectionSequence,
];

export function calculatorsByCategory(category: CalculatorCategory): CalculatorDef[] {
  return CALCULATORS.filter((c) => c.category === category);
}
