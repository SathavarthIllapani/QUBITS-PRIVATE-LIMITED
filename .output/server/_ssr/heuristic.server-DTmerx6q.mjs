import { a as TSS_SERVER_FUNCTION } from "./createServerFn-BhqelEmK.mjs";
import { t as CALCULATORS } from "./registry-CdpUgCOQ.mjs";
import { t as createOpenAI } from "../_libs/ai-sdk__openai+zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/heuristic.server-DTmerx6q.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Server-only AI Gateway helpers.
* Supports OpenAI and OpenAI-compatible providers.
*/
function getAiApiKey() {
	return process.env["OPENAI_API_KEY"] || process.env["AI_API_KEY"];
}
function createResponsesProvider(preferredModel) {
	const apiKey = getAiApiKey();
	if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
	const baseURL = process.env["OPENAI_BASE_URL"] || process.env["AI_GATEWAY_URL"];
	const rawModel = process.env["AI_MODEL"] || preferredModel || "gpt-4o-mini";
	const modelName = rawModel.replace(/^openai\//, "");
	const provider = createOpenAI({
		baseURL,
		apiKey
	});
	return {
		model: typeof provider.responses === "function" && (rawModel.includes("astra") || rawModel.startsWith("responses/")) ? provider.responses(rawModel) : provider(modelName),
		runIdFetch: { fetch }
	};
}
/** Maps a thrown AI SDK / gateway error onto a user-safe message. */
function toUserSafeAiError(error) {
	const name = error != null && typeof error === "object" && "name" in error ? String(error.name) : "";
	const statusRaw = error != null && typeof error === "object" && "statusCode" in error ? Number(error.statusCode) : void 0;
	const status = Number.isFinite(statusRaw) ? statusRaw : void 0;
	if (status === 401) return "Invalid AI API key. Please check your OPENAI_API_KEY in the environment.";
	if (status === 402) return "AI allowance or credits are depleted. Please check your AI account balance.";
	if (status === 403) return "The AI provider refused this request. Check your permissions or model access.";
	if (status === 429) return "The AI service rate limit was reached — please try again in a moment.";
	if (status !== void 0 && status >= 500) return "The AI service had a temporary problem — please try again.";
	if (name === "AbortError") return "The analysis was cancelled.";
	console.error("AI service call failed:", error);
	return "The AI service could not analyse this document. Please try again.";
}
/**
* Intelligent local extraction for lab documents (QC calculations, IPC/GD/09).
* Extracts numeric metrics from certificates of analysis, chromatography reports,
* spreadsheets and text files.
*/
function heuristicExtract(doc, fileName) {
	const lines = doc.parts.filter((p) => p.kind === "text").map((p) => p.text).join("\n").split(/\r?\n/);
	const foundValues = {};
	const patterns = [
		{
			keys: ["stdWeight", "ws"],
			regexes: [/(?:standard\s*weight|std\.?\s*wt|std\s*weight|weight\s*of\s*standard|ws)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: [
				"sampleWeight",
				"wt",
				"sample_wt"
			],
			regexes: [/(?:sample\s*weight|spl\.?\s*wt|sample\s*wt|weight\s*of\s*sample|wt)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["stdArea", "as"],
			regexes: [/(?:standard\s*area|std\.?\s*area|mean\s*standard\s*area|as)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["sampleArea", "at"],
			regexes: [/(?:sample\s*area|spl\.?\s*area|mean\s*sample\s*area|at)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["stdPotency", "purity"],
			regexes: [/(?:potency|purity|standard\s*potency|std\s*purity)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["labelClaim", "lc"],
			regexes: [/(?:label\s*claim|lc|claimed\s*content)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["avgWeight", "averageWeight"],
			regexes: [/(?:average\s*weight|avg\.?\s*wt|avg\s*weight)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: [
				"waterContent",
				"lod",
				"water"
			],
			regexes: [/(?:water\s*content|loss\s*on\s*drying|lod|water\s*\(%w\/w\))[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: [
				"c1",
				"initialConcentration",
				"stockConc"
			],
			regexes: [/(?:stock\s*conc(?:entration)?|initial\s*conc(?:entration)?|c1)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: [
				"c2",
				"targetConcentration",
				"finalConc"
			],
			regexes: [/(?:target\s*conc(?:entration)?|final\s*conc(?:entration)?|c2)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: [
				"v2",
				"targetVolume",
				"finalVolume"
			],
			regexes: [/(?:target\s*volume|final\s*volume|required\s*volume|v2)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: [
				"v1",
				"stockVolume",
				"aliquotVolume"
			],
			regexes: [/(?:aliquot\s*volume|stock\s*volume|v1)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["stdDilution1", "stdDil1"],
			regexes: [/(?:std\s*dil(?:ution)?\s*1|standard\s*dilution\s*1)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["stdDilution2", "stdDil2"],
			regexes: [/(?:std\s*dil(?:ution)?\s*2|standard\s*dilution\s*2)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["sampleDilution1", "splDil1"],
			regexes: [/(?:sample\s*dil(?:ution)?\s*1|spl\s*dilution\s*1)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["sampleDilution2", "splDil2"],
			regexes: [/(?:sample\s*dil(?:ution)?\s*2|spl\s*dilution\s*2)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["titre", "titrantVolume"],
			regexes: [/(?:titrant\s*volume|titre\s*value|burette\s*reading)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["normality", "actualNormality"],
			regexes: [/(?:normality|actual\s*normality)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		},
		{
			keys: ["rsd", "percentRsd"],
			regexes: [/(?:%?\s*rsd|relative\s*standard\s*deviation)[\s:=]+([0-9]+(?:\.[0-9]+)?)/i]
		}
	];
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const parts = trimmed.split(/[,;\t|]/).map((p) => p.trim());
		if (parts.length >= 2) {
			const label = parts[0].toLowerCase();
			const numMatch = parts[1].match(/^[-+]?[0-9]+(?:\.[0-9]+)?$/);
			if (numMatch) {
				for (const item of patterns) for (const key of item.keys) if (label.includes(key.toLowerCase()) || label === key.toLowerCase()) foundValues[key] = numMatch[0];
			}
		}
		for (const item of patterns) for (const regex of item.regexes) {
			const match = trimmed.match(regex);
			if (match && match[1]) foundValues[item.keys[0]] = match[1];
		}
	}
	const scoredCalculators = CALCULATORS.map((calc) => {
		let matchedFieldCount = 0;
		const values = {};
		for (const field of calc.fields) {
			if (foundValues[field.key]) {
				values[field.key] = foundValues[field.key];
				matchedFieldCount++;
				continue;
			}
			const matchedAlias = patterns.find((p) => p.keys.includes(field.key));
			if (matchedAlias) {
				for (const alias of matchedAlias.keys) if (foundValues[alias]) {
					values[field.key] = foundValues[alias];
					matchedFieldCount++;
					break;
				}
			}
		}
		const totalFields = calc.fields.length || 1;
		const coverage = matchedFieldCount / totalFields;
		const confidence = matchedFieldCount > 0 ? Math.min(.98, Math.max(.4, Number((.4 + coverage * .55).toFixed(2)))) : 0;
		return {
			calculatorId: calc.id,
			title: calc.title,
			confidence,
			values,
			matchedFieldCount,
			notes: matchedFieldCount > 0 ? `Extracted ${matchedFieldCount} of ${totalFields} fields directly from the document.` : "Recommended based on document context; verify fields before calculating."
		};
	}).filter((c) => c.matchedFieldCount > 0).sort((a, b) => b.confidence - a.confidence || b.matchedFieldCount - a.matchedFieldCount).slice(0, 4);
	const suggestions = scoredCalculators.length > 0 ? scoredCalculators.map((c) => ({
		calculatorId: c.calculatorId,
		confidence: c.confidence,
		values: c.values,
		notes: c.notes
	})) : [{
		calculatorId: "assay-hplc",
		confidence: .75,
		values: {},
		notes: "HPLC assay detected. Enter or review sample & standard values."
	}, {
		calculatorId: "stock-dilution",
		confidence: .65,
		values: {},
		notes: "Dilution calculation recommended."
	}];
	return {
		summary: scoredCalculators.length > 0 ? `Extracted ${Object.keys(foundValues).length} lab parameter(s) from "${fileName}". Matched ${scoredCalculators.length} QC calculator profile(s).` : `Document "${fileName}" parsed. Review and select a calculator from the registry below.`,
		suggestions
	};
}
/**
* Intelligent local trend review over reviewed assay & potency runs.
* Computes mean, relative standard deviation (RSD), min/max range,
* sequence drift, and flags based on Indian Pharmacopoeia limits.
*/
function heuristicTrendReview(runs) {
	const flags = [];
	const followUps = [];
	const primaryResults = [];
	for (const run of runs) {
		if (!run.outputs) continue;
		for (const [key, val] of Object.entries(run.outputs)) if (typeof val === "number" && !isNaN(val)) {
			primaryResults.push(val);
			break;
		}
	}
	const count = runs.length;
	let summary = `Analyzed ${count} reviewed assay & potency runs in chronological sequence.`;
	if (primaryResults.length >= 2) {
		const mean = primaryResults.reduce((a, b) => a + b, 0) / primaryResults.length;
		const variance = primaryResults.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (primaryResults.length - 1);
		const rsd = Math.sqrt(variance) / mean * 100;
		const min = Math.min(...primaryResults);
		const max = Math.max(...primaryResults);
		max - min;
		summary += ` Mean result is ${mean.toFixed(2)}% with an RSD of ${rsd.toFixed(2)}% across the batches (range: ${min.toFixed(2)}%–${max.toFixed(2)}%).`;
		if (rsd > 2) {
			flags.push({
				calculatorId: runs[0].calculatorId || "",
				metric: "Sequence Precision (RSD)",
				severity: rsd > 3 ? "unusual" : "watch",
				detail: `The overall RSD is ${rsd.toFixed(2)}% across ${count} runs (IPC target is typically ≤ 2.0% for drug substance assays).`
			});
			followUps.push({
				title: "Investigate Assay Precision Variability",
				detail: "Verify pipetting accuracy, volumetric flask calibrations, and instrument system suitability (tailing factor and column pressure)."
			});
		} else flags.push({
			calculatorId: runs[0].calculatorId || "",
			metric: "Sequence Precision (RSD)",
			severity: "normal",
			detail: `Precision is consistent with an RSD of ${rsd.toFixed(2)}%, well within the IPC acceptance criteria (≤ 2.0%).`
		});
		const firstVal = primaryResults[0];
		const lastVal = primaryResults[primaryResults.length - 1];
		const drift = Math.abs(lastVal - firstVal);
		if (drift > 2.5) {
			flags.push({
				calculatorId: runs[0].calculatorId || "",
				metric: "Batch Sequence Drift",
				severity: "watch",
				detail: `Shift of ${drift.toFixed(2)}% observed between the first run (${firstVal.toFixed(2)}%) and the latest run (${lastVal.toFixed(2)}%).`
			});
			followUps.push({
				title: "Verify Reagent Stability and Standards",
				detail: "Check mobile phase degradation, working standard stability over time, or sample solution evaporation."
			});
		}
	}
	let failCount = 0;
	for (const run of runs) for (const v of run.verdicts ?? []) if (v.status === "fail") {
		failCount++;
		flags.push({
			calculatorId: run.calculatorId || "",
			metric: `${run.fileName} Verdict`,
			severity: "unusual",
			detail: `Out-of-specification result: ${v.message}`
		});
	}
	if (failCount > 0) followUps.unshift({
		title: "Out-of-Specification (OOS) Procedure",
		detail: `Initiate Phase I laboratory investigation for ${failCount} non-conforming run(s) before batch release per IPC/CDSCO guidelines.`
	});
	else followUps.push({
		title: "Routine Trend Archival",
		detail: "Archive this trend review in the batch record file and continue standard trend monitoring for subsequent lots."
	});
	return {
		summary,
		flags: flags.slice(0, 8),
		followUps: followUps.slice(0, 5)
	};
}
//#endregion
export { heuristicTrendReview as a, heuristicExtract as i, createServerRpc as n, toUserSafeAiError as o, getAiApiKey as r, createResponsesProvider as t };
