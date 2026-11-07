import { describe, expect, it } from "vitest";

import { CALCULATORS } from "./registry";

const get = (id: string) => {
  const def = CALCULATORS.find((c) => c.id === id);
  if (!def) throw new Error(`missing calculator ${id}`);
  return def;
};

describe("assay-as-is", () => {
  const def = get("assay-as-is");
  const base = {
    stdArea: "1000",
    stdWt: "10",
    stdDil: "50",
    stdPurity: "99.5",
    testArea: "1005",
    testWt: "10.05",
    testDil: "50",
  };

  it("computes the IPC/GD/09 formula", () => {
    const result = def.compute(base);
    expect(result.outputs["assay"]).toBe(99.5);
    expect(result.outputs["reported"]).toBe(99.5);
    expect(result.verdicts[0]?.status).toBe("pass");
  });

  it("caps results above 100.0% w/w at 100.0% with a warn verdict", () => {
    const result = def.compute({ ...base, stdPurity: "100.5" });
    expect(result.outputs["assay"]).toBeGreaterThan(100);
    expect(result.outputs["reported"]).toBe(100);
    expect(result.verdicts[0]?.status).toBe("warn");
  });
});

describe("assay-dried-basis", () => {
  it("converts as-is assay using water content", () => {
    const result = get("assay-dried-basis").compute({ assayAsIs: "99.5", water: "0.5" });
    expect(result.outputs["assayDried"]).toBe(100);
  });
});

describe("correlation", () => {
  const def = get("correlation");

  it("passes between 99.0% and 101.0%", () => {
    const result = def.compute({ areaS1: "1000", areaS2: "1000", wtS1: "10", wtS2: "10" });
    expect(result.outputs["correlation"]).toBe(100);
    expect(result.verdicts[0]?.status).toBe("pass");
  });

  it("fails below 99.0% with the retest message", () => {
    const result = def.compute({ areaS1: "970", areaS2: "1000", wtS1: "10", wtS2: "10" });
    expect(result.outputs["correlation"]).toBe(97);
    expect(result.verdicts[0]?.status).toBe("fail");
  });
});

describe("rsd", () => {
  const def = get("rsd");
  const series = { series: "100, 102" };

  it("applies the assay NMT 1.0% limit", () => {
    const result = def.compute({ ...series, testType: "assay" });
    expect(result.outputs["rsd"]).toBeCloseTo(1.4, 1);
    expect(result.verdicts[0]?.status).toBe("fail");
  });

  it("applies the overall NMT 2.0% limit to the same data", () => {
    const result = def.compute({ ...series, testType: "overall" });
    expect(result.verdicts[0]?.status).toBe("pass");
  });
});

describe("potency-assignment", () => {
  const def = get("potency-assignment");

  it("assigns the mean of triplicate results", () => {
    const result = def.compute({
      r1: "99.5",
      r2: "99.6",
      r3: "99.4",
      materialType: "chemical",
    });
    expect(result.outputs["potency"]).toBe(99.5);
    expect(result.verdicts[0]?.status).toBe("pass");
  });

  it("caps a chemical mean above 100% at 100% but not a biological one", () => {
    const values = { r1: "100.5", r2: "100.4", r3: "100.6" };
    const chemical = def.compute({ ...values, materialType: "chemical" });
    expect(chemical.outputs["potency"]).toBe(100);
    expect(chemical.verdicts.some((v) => v.status === "warn")).toBe(true);
    const biological = def.compute({ ...values, materialType: "biological" });
    expect(biological.outputs["potency"]).toBe(100.5);
  });
});

describe("vial-subdivision", () => {
  it("splits a 12 g batch into 1 g vials", () => {
    const result = get("vial-subdivision").compute({
      totalQty: "12",
      perVial: "1",
      validityMonths: "12",
    });
    expect(result.outputs["vials"]).toBe(12);
    expect(result.verdicts[0]?.status).toBe("pass");
  });

  it("rejects validity beyond twelve months", () => {
    const result = get("vial-subdivision").compute({
      totalQty: "12",
      perVial: "1",
      validityMonths: "13",
    });
    expect(result.verdicts[0]?.status).toBe("fail");
  });
});

describe("injection-sequence", () => {
  it("emits the IPC sequence with blank, suitability, standards, samples and bracketing", () => {
    const result = get("injection-sequence").compute({ samples: "3", systemSuitability: "yes" });
    expect(result.outputs["total"]).toBe(16);
    expect(result.outputs["sequence"]).toContain("Standard-1 — 5 injections");
    expect(result.outputs["sequence"]).toContain("Sample-3 — 2 injections");
    expect(result.outputs["sequence"]).toContain("Bracketing standard — 1 injection");
  });
});
