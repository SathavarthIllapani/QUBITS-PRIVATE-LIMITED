import { l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { i as requireSupabaseAuth, t as CALCULATORS } from "./registry-CdpUgCOQ.mjs";
import { it as jsonSchema } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { a as heuristicTrendReview, n as createServerRpc, r as getAiApiKey, t as createResponsesProvider } from "./heuristic.server-DTmerx6q.mjs";
import { n as streamText, t as output_exports } from "../_libs/ai.mjs";
import { a as objectType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as isTrendEligible } from "./trend-select-DWBSGD1m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trend.functions-CUhVjM5U.js
/**
* Server functions for the AI trend review over saved assay & potency runs.
* Reviewed results the analyst selects are summarised by the model: trends,
* unusual shifts and suggested follow-up checks — always for human review.
*/
var DEFAULT_MODEL = "gpt-4o-mini";
/** Trends need a chronology: at least two reviewed runs. */
var MIN_RUNS = 2;
var generateInput = objectType({ ids: arrayType(stringType().uuid()).min(MIN_RUNS).max(20) });
var deleteInput = objectType({ id: stringType().uuid() });
var trendJsonSchema = jsonSchema({
	type: "object",
	properties: {
		summary: {
			type: "string",
			description: "Two to four sentences describing the trend across the selected assay & potency runs."
		},
		flags: {
			type: "array",
			items: {
				type: "object",
				properties: {
					calculatorId: { type: "string" },
					metric: {
						type: "string",
						description: "The value being commented on, e.g. 'Assay (as-is basis)' or 'RSD'."
					},
					severity: {
						type: "string",
						enum: [
							"normal",
							"watch",
							"unusual"
						]
					},
					detail: {
						type: "string",
						description: "One or two sentences grounded in the provided numbers only."
					}
				},
				required: [
					"calculatorId",
					"metric",
					"severity",
					"detail"
				],
				additionalProperties: false
			}
		},
		followUps: {
			type: "array",
			items: {
				type: "object",
				properties: {
					title: {
						type: "string",
						description: "Short label of a concrete laboratory follow-up check."
					},
					detail: {
						type: "string",
						description: "What to do and which run(s) it concerns."
					}
				},
				required: ["title", "detail"],
				additionalProperties: false
			}
		}
	},
	required: [
		"summary",
		"flags",
		"followUps"
	],
	additionalProperties: false
});
var SYSTEM_PROMPT = `You are the trend-review assistant for the Qubits lab calculator suite (Indian Pharmacopoeia QC calculations, IPC/GD/09).
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
function rowToDto(row) {
	const status = row.status === "reviewed" ? "reviewed" : "analyzed";
	return {
		id: row.id,
		fileName: row.file_name,
		mimeType: row.mime_type,
		storagePath: row.storage_path,
		summary: row.summary,
		suggestions: Array.isArray(row.suggestions) ? row.suggestions : [],
		calculatorId: row.calculator_id,
		values: row.values ?? null,
		outputs: row.outputs ?? null,
		verdicts: row.verdicts ?? null,
		status,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function formatRun(entry) {
	const calc = CALCULATORS.find((c) => c.id === entry.calculatorId);
	return [
		`run_id: ${entry.id}`,
		`document: ${entry.fileName}`,
		`calculator: ${calc?.title ?? entry.calculatorId} (${entry.calculatorId})`,
		`saved_at: ${entry.createdAt}`,
		`inputs: ${JSON.stringify(entry.values ?? {})}`,
		`outputs: ${JSON.stringify(entry.outputs ?? {})}`,
		`verdicts: ${JSON.stringify((entry.verdicts ?? []).map((verdict) => `${verdict.status}: ${verdict.message}`))}`
	].join("\n");
}
var SEVERITIES = [
	"normal",
	"watch",
	"unusual"
];
function sanitizeReport(raw) {
	if (raw == null || typeof raw !== "object") return { report: null };
	const value = raw;
	const flags = Array.isArray(value.flags) ? value.flags.map((flag) => {
		if (flag == null || typeof flag !== "object") return null;
		const f = flag;
		if (typeof f.detail !== "string") return null;
		const severity = SEVERITIES.includes(f.severity) ? f.severity : "watch";
		return {
			calculatorId: typeof f.calculatorId === "string" ? f.calculatorId : "",
			metric: typeof f.metric === "string" ? f.metric : "Result",
			severity,
			detail: f.detail
		};
	}).filter((flag) => flag !== null) : [];
	const followUps = Array.isArray(value.followUps) ? value.followUps.map((item) => {
		if (item == null || typeof item !== "object") return null;
		const f = item;
		return typeof f.title === "string" && typeof f.detail === "string" ? {
			title: f.title,
			detail: f.detail
		} : null;
	}).filter((item) => item !== null) : [];
	return { report: {
		summary: typeof value.summary === "string" && value.summary.trim() ? value.summary.trim() : "Trend review complete.",
		flags: flags.slice(0, 8),
		followUps: followUps.slice(0, 5)
	} };
}
var generateTrendReview_createServerFn_handler = createServerRpc({
	id: "4a6a662f8a8260026c99d58d556301c54b561f796ed1f2a1f125d8e1b598a1a4",
	name: "generateTrendReview",
	filename: "src/lib/analysis/trend.functions.ts"
}, (opts) => generateTrendReview.__executeServer(opts));
var generateTrendReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => generateInput.parse(input)).handler(generateTrendReview_createServerFn_handler, async ({ data, context }) => {
	const { data: rows, error } = await context.supabase.from("analyses").select("*").in("id", data.ids);
	if (error) {
		console.error("Failed to load runs for trend review:", error);
		return {
			ok: false,
			error: "Could not load the selected runs."
		};
	}
	const candidates = (rows ?? []).map((row) => rowToDto(row)).filter(isTrendEligible).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
	if (candidates.length < MIN_RUNS) return {
		ok: false,
		error: `A trend needs at least ${MIN_RUNS} reviewed assay & potency runs with saved results. Review and save more runs first.`
	};
	const usedIds = candidates.map((candidate) => candidate.id);
	const usedCalculators = [...new Set(candidates.map((candidate) => candidate.calculatorId))];
	let report = null;
	if (getAiApiKey()) try {
		const { model } = createResponsesProvider(DEFAULT_MODEL);
		const runText = candidates.map(formatRun).join("\n\n");
		report = sanitizeReport(await streamText({
			model,
			system: SYSTEM_PROMPT,
			messages: [{
				role: "user",
				content: `Review these ${candidates.length} saved assay & potency runs (oldest first):\n\n${runText}\n\nReturn the trend review as JSON. Use only these calculatorId values: ${usedCalculators.join(", ")}.`
			}],
			output: output_exports.object({ schema: trendJsonSchema })
		}).output).report;
	} catch (aiError) {
		console.warn("AI trend review unavailable, using statistical heuristic review:", aiError);
		report = heuristicTrendReview(candidates);
	}
	else report = heuristicTrendReview(candidates);
	if (!report) return {
		ok: false,
		error: "The trend review could not be generated. Please try again."
	};
	const flags = report.flags.filter((flag) => !flag.calculatorId || usedCalculators.includes(flag.calculatorId));
	const { data: row, error: insertError } = await context.supabase.from("trend_reviews").insert({
		analysis_ids: usedIds,
		report: {
			...report,
			flags
		}
	}).select().single();
	if (insertError || !row) {
		console.error("Failed to save trend review:", insertError);
		return {
			ok: false,
			error: "The trend analysis worked but could not be saved to your history."
		};
	}
	const saved = row;
	const savedReport = sanitizeReport(saved.report).report ?? report;
	return {
		ok: true,
		review: {
			id: saved.id,
			analysisIds: Array.isArray(saved.analysis_ids) ? saved.analysis_ids : usedIds,
			report: savedReport,
			createdAt: saved.created_at
		}
	};
});
var listTrendReviews_createServerFn_handler = createServerRpc({
	id: "3751ff1399ea96a718cdcbc4d6a5404ae18d7fd50e73152f6682c0a1fc667323",
	name: "listTrendReviews",
	filename: "src/lib/analysis/trend.functions.ts"
}, (opts) => listTrendReviews.__executeServer(opts));
var listTrendReviews = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listTrendReviews_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("trend_reviews").select("id, analysis_ids, report, created_at").order("created_at", { ascending: false }).limit(20);
	if (error) {
		console.error("Failed to list trend reviews:", error);
		return {
			ok: false,
			reviews: [],
			error: "Could not load your trend reviews."
		};
	}
	const reviews = [];
	for (const row of data ?? []) {
		const saved = row;
		const { report } = sanitizeReport(saved.report);
		if (!report) continue;
		reviews.push({
			id: saved.id,
			analysisIds: Array.isArray(saved.analysis_ids) ? saved.analysis_ids : [],
			report,
			createdAt: saved.created_at
		});
	}
	return {
		ok: true,
		reviews
	};
});
var deleteTrendReview_createServerFn_handler = createServerRpc({
	id: "5a8c7943bf582ce3700adf9fa8ae8393978a11ba46396586959087ed85686075",
	name: "deleteTrendReview",
	filename: "src/lib/analysis/trend.functions.ts"
}, (opts) => deleteTrendReview.__executeServer(opts));
var deleteTrendReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => deleteInput.parse(input)).handler(deleteTrendReview_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("trend_reviews").delete().eq("id", data.id);
	if (error) {
		console.error("Failed to delete trend review:", error);
		return {
			ok: false,
			error: "Could not delete this trend review."
		};
	}
	return { ok: true };
});
//#endregion
export { deleteTrendReview_createServerFn_handler, generateTrendReview_createServerFn_handler, listTrendReviews_createServerFn_handler };
