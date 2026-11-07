import { l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { i as requireSupabaseAuth, t as CALCULATORS } from "./registry-CdpUgCOQ.mjs";
import { it as jsonSchema } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { i as heuristicExtract, n as createServerRpc, o as toUserSafeAiError, r as getAiApiKey, t as createResponsesProvider } from "./heuristic.server-DTmerx6q.mjs";
import { n as streamText, t as output_exports } from "../_libs/ai.mjs";
import { a as objectType, c as unionType, i as numberType, n as enumType, o as recordType, r as nullType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as unzipSync } from "../_libs/fflate.mjs";
import { n as getDocumentProxy, t as extractText } from "../_libs/unpdf.mjs";
import { n as utils, t as readSync } from "../_libs/xlsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/functions-BMoqkB_O.js
/**
* Extracts text, images and scanned-PDF payloads from uploaded lab documents
* so they can be sent to the AI model. Server-only (runs on the Worker).
*
* Supported: PDF, Excel (xlsx/xls/xlsm), CSV, TXT, JSON, MD, ZIP (recursing
* into the archive) and common image formats.
*/
var MAX_TEXT_TOTAL = 3e4;
var MAX_TEXT_PER_PART = 16e3;
var MAX_IMAGE_PARTS = 4;
var MAX_IMAGE_BYTES = 6291456;
var MAX_PDF_INLINE_BYTES = 8388608;
var MAX_ZIP_ENTRIES = 30;
var MAX_ZIP_ENTRY_BYTES = 8388608;
var IMAGE_EXTS = {
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	webp: "image/webp",
	gif: "image/gif"
};
function extOf(name) {
	const lower = name.toLowerCase();
	const dot = lower.lastIndexOf(".");
	return dot === -1 ? "" : lower.slice(dot + 1);
}
function toBase64(bytes) {
	let binary = "";
	const chunkSize = 32768;
	for (let i = 0; i < bytes.length; i += chunkSize) binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	return btoa(binary);
}
async function extractDocument(fileName, mimeType, bytes) {
	const doc = {
		parts: [],
		warnings: []
	};
	const name = fileName || "document";
	try {
		await collect(extOf(name), mimeType, bytes, name, doc, 0);
	} catch (error) {
		doc.warnings.push(`${name}: could not be read (${describeError(error)}).`);
	}
	return doc;
}
function describeError(error) {
	return error instanceof Error ? error.message.slice(0, 160) : String(error).slice(0, 160);
}
function imageCount(doc) {
	return doc.parts.filter((p) => p.kind === "image").length;
}
function pushText(doc, name, text) {
	const budget = MAX_TEXT_TOTAL - doc.parts.reduce((sum, p) => p.kind === "text" ? sum + p.text.length : sum, 0);
	if (budget <= 0) {
		doc.warnings.push(`${name}: skipped — the document set is already very large.`);
		return;
	}
	const limited = text.length > Math.min(budget, MAX_TEXT_PER_PART) ? text.slice(0, Math.min(budget, MAX_TEXT_PER_PART)) : text;
	if (limited.length < text.length) doc.warnings.push(`${name}: very large — only the first ${limited.length.toLocaleString()} characters were read.`);
	if (limited.trim()) doc.parts.push({
		kind: "text",
		name,
		text: limited
	});
}
async function collect(ext, mime, bytes, name, doc, depth) {
	if (doc.parts.length >= 40) return;
	const imageMime = IMAGE_EXTS[ext] ?? (mime.startsWith("image/") ? mime : "");
	if (imageMime) {
		if (bytes.length > MAX_IMAGE_BYTES) {
			doc.warnings.push(`${name}: image too large to read.`);
			return;
		}
		if (imageCount(doc) >= MAX_IMAGE_PARTS) {
			doc.warnings.push(`${name}: skipped — at most ${MAX_IMAGE_PARTS} images can be read per upload.`);
			return;
		}
		doc.parts.push({
			kind: "image",
			name,
			dataUrl: `data:${imageMime};base64,${toBase64(bytes)}`
		});
		return;
	}
	if (ext === "pdf") {
		await collectPdf(name, bytes, doc);
		return;
	}
	if (ext === "xlsx" || ext === "xls" || ext === "xlsm") {
		collectExcel(name, bytes, doc);
		return;
	}
	if (ext === "zip") {
		collectZip(name, bytes, doc, depth);
		return;
	}
	collectText(name, bytes, doc);
}
async function collectPdf(name, bytes, doc) {
	try {
		const pdf = await getDocumentProxy(bytes);
		const { text } = await extractText(pdf, { mergePages: false });
		const pages = Array.isArray(text) ? text : [text];
		const joined = pages.map((page) => page.trim()).filter(Boolean).join("\n\n");
		if (joined.length >= 120) {
			pushText(doc, name, `PDF document, ${pages.length} page(s).\n\n${joined}`);
			return;
		}
		if (bytes.length <= MAX_PDF_INLINE_BYTES) {
			doc.warnings.push(`${name}: little or no selectable text (likely a scan or photo PDF) — reading it as a document instead.`);
			doc.parts.push({
				kind: "pdf",
				name,
				base64: toBase64(bytes)
			});
			return;
		}
		doc.warnings.push(`${name}: no readable text found and the file is too large to read as a document image.`);
	} catch (error) {
		doc.warnings.push(`${name}: could not be read as a PDF (${describeError(error)}).`);
	}
}
function collectExcel(name, bytes, doc) {
	try {
		const workbook = readSync(bytes, { type: "array" });
		const chunks = [];
		for (const sheetName of workbook.SheetNames.slice(0, 15)) {
			const sheet = workbook.Sheets[sheetName];
			if (!sheet) continue;
			const csv = utils.sheet_to_csv(sheet, { blankrows: false }).trim();
			if (!csv) continue;
			chunks.push(`## Sheet: ${sheetName}\n${csv.slice(0, 12e3)}`);
		}
		if (chunks.length === 0) {
			doc.warnings.push(`${name}: no readable data rows found in the spreadsheet.`);
			return;
		}
		pushText(doc, name, `Excel workbook.\n\n${chunks.join("\n\n")}`);
	} catch (error) {
		doc.warnings.push(`${name}: could not be read as a spreadsheet (${describeError(error)}).`);
	}
}
function collectZip(name, bytes, doc, depth) {
	try {
		const entries = unzipSync(bytes);
		let processed = 0;
		for (const [path, content] of Object.entries(entries)) {
			if (processed >= MAX_ZIP_ENTRIES) {
				doc.warnings.push(`${name}: more than ${MAX_ZIP_ENTRIES} files inside — only the first ${MAX_ZIP_ENTRIES} were read.`);
				break;
			}
			if (path.endsWith("/") || path.includes("__MACOSX") || path.split("/").some((seg) => seg.startsWith("."))) continue;
			if (content.length > MAX_ZIP_ENTRY_BYTES) continue;
			const base = path.split("/").pop() ?? path;
			const ext = extOf(base);
			const entryName = depth > 0 ? base : `${name} → ${base}`;
			if (ext === "zip" && depth < 2) collectZip(entryName, content, doc, depth + 1);
			else collect(ext, "", content, entryName, doc, depth + 1);
			processed += 1;
		}
		if (processed === 0) doc.warnings.push(`${name}: the archive appears to be empty.`);
	} catch (error) {
		doc.warnings.push(`${name}: could not be opened as a ZIP archive (${describeError(error)}).`);
	}
}
function collectText(name, bytes, doc) {
	const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes).trim();
	if (!text) return;
	if (text.replace(/[^\t\n\r\x20-\x7e\u00a0-\uffff]/g, "").length < text.length * .8) {
		doc.warnings.push(`${name}: unsupported file format — no readable text could be extracted.`);
		return;
	}
	pushText(doc, name, text);
}
/**
* Server functions for the upload → extract → review → calculate workflow.
* Every function requires an authenticated session; RLS scopes rows to the
* caller's user_id.
*/
var BUCKET = "analysis-documents";
var DEFAULT_MODEL = "gpt-4o-mini";
var analyzeInput = objectType({
	path: stringType().min(1),
	fileName: stringType().min(1).max(255),
	mimeType: stringType().max(190).optional()
});
var saveInput = objectType({
	id: stringType().uuid(),
	calculatorId: stringType().min(1),
	values: recordType(stringType(), stringType()),
	outputs: recordType(stringType(), unionType([
		numberType(),
		stringType(),
		nullType()
	])),
	verdicts: arrayType(objectType({
		status: enumType([
			"pass",
			"fail",
			"warn",
			"info"
		]),
		message: stringType()
	}))
});
var deleteInput = objectType({ id: stringType().uuid() });
/** Strict-compatible wire schema for the structured extraction result. */
var extractionJsonSchema = jsonSchema({
	type: "object",
	properties: {
		summary: {
			type: "string",
			description: "One or two sentences describing what the document(s) contain."
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
							properties: {
								key: { type: "string" },
								value: { type: "string" }
							},
							required: ["key", "value"],
							additionalProperties: false
						}
					},
					notes: { type: "string" }
				},
				required: [
					"calculatorId",
					"confidence",
					"values",
					"notes"
				],
				additionalProperties: false
			}
		}
	},
	required: ["summary", "suggestions"],
	additionalProperties: false
});
function buildCatalog() {
	return JSON.stringify(CALCULATORS.map((calc) => ({
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
			options: field.options?.map((option) => option.value)
		}))
	})));
}
var SYSTEM_PROMPT = `You are the data-extraction assistant for the Qubits lab calculator suite (Indian Pharmacopoeia QC calculations, IPC/GD/09).
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
function toDto(row) {
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
var analyzeUpload_createServerFn_handler = createServerRpc({
	id: "984f5df7a88930a89725dc816fc81ee67fdaa2bc6ab0fbca2e53f93b6fac29b6",
	name: "analyzeUpload",
	filename: "src/lib/analysis/functions.ts"
}, (opts) => analyzeUpload.__executeServer(opts));
var analyzeUpload = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => analyzeInput.parse(input)).handler(analyzeUpload_createServerFn_handler, async ({ data, context }) => {
	const userId = context.userId;
	if (!userId || !data.path.startsWith(`${userId}/`)) return {
		ok: false,
		error: "You can only analyse files you uploaded yourself."
	};
	const { data: blob, error: downloadError } = await context.supabase.storage.from(BUCKET).download(data.path);
	if (downloadError || !blob) return {
		ok: false,
		error: "Could not read the uploaded file. Please try uploading it again."
	};
	const bytes = new Uint8Array(await blob.arrayBuffer());
	const doc = await extractDocument(data.fileName, blob.type || data.mimeType || "", bytes);
	if (doc.parts.length === 0) return {
		ok: false,
		error: "Nothing readable was found in this file. Supported: PDF, Excel, CSV, TXT, JSON, ZIP and images."
	};
	let summary = "Document analysed.";
	let suggestions = [];
	if (getAiApiKey()) try {
		const { model } = createResponsesProvider(DEFAULT_MODEL);
		const messageContent = [];
		for (const part of doc.parts) if (part.kind === "text") messageContent.push({
			type: "text",
			text: `--- ${part.name} ---\n${part.text}`
		});
		else if (part.kind === "image") messageContent.push({
			type: "image",
			image: part.dataUrl
		});
		else messageContent.push({
			type: "file",
			filename: part.name,
			mediaType: "application/pdf",
			data: part.base64
		});
		for (const warning of doc.warnings) messageContent.push({
			type: "text",
			text: `[note: ${warning}]`
		});
		const parsed = await streamText({
			model,
			system: SYSTEM_PROMPT,
			messages: [{
				role: "user",
				content: messageContent
			}],
			output: output_exports.object({ schema: extractionJsonSchema })
		}).output;
		suggestions = (parsed.suggestions ?? []).map((suggestion) => ({
			calculatorId: suggestion.calculatorId,
			confidence: Math.max(0, Math.min(1, Number(suggestion.confidence) || 0)),
			values: Object.fromEntries((suggestion.values ?? []).filter((entry) => typeof entry?.key === "string" && typeof entry?.value === "string").map((entry) => [entry.key, entry.value])),
			notes: typeof suggestion.notes === "string" ? suggestion.notes : ""
		})).filter((suggestion) => CALCULATORS.some((calc) => calc.id === suggestion.calculatorId)).slice(0, 4);
		summary = typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.trim() : "Document analysed.";
	} catch (aiError) {
		console.warn("AI extraction unavailable, using heuristic extraction:", aiError);
		const fallback = heuristicExtract(doc, data.fileName);
		summary = fallback.summary;
		suggestions = fallback.suggestions;
	}
	else {
		const fallback = heuristicExtract(doc, data.fileName);
		summary = fallback.summary;
		suggestions = fallback.suggestions;
	}
	try {
		const { data: row, error: insertError } = await context.supabase.from("analyses").insert({
			user_id: userId,
			file_name: data.fileName,
			mime_type: blob.type || data.mimeType || null,
			storage_path: data.path,
			summary,
			suggestions,
			status: "analyzed"
		}).select().single();
		if (insertError || !row) {
			console.error("Failed to save analysis row:", insertError);
			return {
				ok: false,
				error: "The analysis worked but could not be saved to your history."
			};
		}
		return {
			ok: true,
			analysis: toDto(row)
		};
	} catch (error) {
		return {
			ok: false,
			error: toUserSafeAiError(error)
		};
	}
});
var listAnalyses_createServerFn_handler = createServerRpc({
	id: "e56797a5a12395b1b225188115b3b9de2cc18986f9caf41b48bd0281639eb719",
	name: "listAnalyses",
	filename: "src/lib/analysis/functions.ts"
}, (opts) => listAnalyses.__executeServer(opts));
var listAnalyses = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAnalyses_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("analyses").select("*").order("created_at", { ascending: false }).limit(50);
	if (error) {
		console.error("Failed to list analyses:", error);
		return {
			ok: false,
			analyses: [],
			error: "Could not load your history."
		};
	}
	return {
		ok: true,
		analyses: (data ?? []).map((row) => toDto(row))
	};
});
var saveReviewedAnalysis_createServerFn_handler = createServerRpc({
	id: "03bbd089d67c9b4420d326b00487041adfbedd43b97d803f2102c77333d79c36",
	name: "saveReviewedAnalysis",
	filename: "src/lib/analysis/functions.ts"
}, (opts) => saveReviewedAnalysis.__executeServer(opts));
var saveReviewedAnalysis = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => saveInput.parse(input)).handler(saveReviewedAnalysis_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("analyses").update({
		calculator_id: data.calculatorId,
		values: data.values,
		outputs: data.outputs,
		verdicts: data.verdicts,
		status: "reviewed",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) {
		console.error("Failed to save reviewed analysis:", error);
		return {
			ok: false,
			error: "Could not save to your history."
		};
	}
	return { ok: true };
});
var deleteAnalysis_createServerFn_handler = createServerRpc({
	id: "41435b2e381426ae03a4da2593ecc2ba58d3654c0d3b00b0c91e333d9d287ab4",
	name: "deleteAnalysis",
	filename: "src/lib/analysis/functions.ts"
}, (opts) => deleteAnalysis.__executeServer(opts));
var deleteAnalysis = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => deleteInput.parse(input)).handler(deleteAnalysis_createServerFn_handler, async ({ data, context }) => {
	const { data: row } = await context.supabase.from("analyses").select("storage_path").eq("id", data.id).single();
	const { error } = await context.supabase.from("analyses").delete().eq("id", data.id);
	if (error) {
		console.error("Failed to delete analysis:", error);
		return {
			ok: false,
			error: "Could not delete this history entry."
		};
	}
	if (row?.storage_path) await context.supabase.storage.from(BUCKET).remove([row.storage_path]);
	return { ok: true };
});
//#endregion
export { analyzeUpload_createServerFn_handler, deleteAnalysis_createServerFn_handler, listAnalyses_createServerFn_handler, saveReviewedAnalysis_createServerFn_handler };
