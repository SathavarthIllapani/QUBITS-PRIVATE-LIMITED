/**
 * Extracts text, images and scanned-PDF payloads from uploaded lab documents
 * so they can be sent to the AI model. Server-only (runs on the Worker).
 *
 * Supported: PDF, Excel (xlsx/xls/xlsm), CSV, TXT, JSON, MD, ZIP (recursing
 * into the archive) and common image formats.
 */
import { unzipSync } from "fflate";
import { extractText, getDocumentProxy } from "unpdf";
import * as XLSX from "xlsx";

export interface ExtractedTextPart {
  kind: "text";
  name: string;
  text: string;
}

export interface ExtractedImagePart {
  kind: "image";
  name: string;
  dataUrl: string;
}

/** A scanned PDF without selectable text, passed to the model as a document. */
export interface ExtractedPdfPart {
  kind: "pdf";
  name: string;
  base64: string;
}

export type ExtractedPart = ExtractedTextPart | ExtractedImagePart | ExtractedPdfPart;

export interface ExtractedDoc {
  parts: ExtractedPart[];
  warnings: string[];
}

const MAX_TEXT_TOTAL = 30_000;
const MAX_TEXT_PER_PART = 16_000;
const MAX_IMAGE_PARTS = 4;
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_PDF_INLINE_BYTES = 8 * 1024 * 1024;
const MAX_ZIP_ENTRIES = 30;
const MAX_ZIP_ENTRY_BYTES = 8 * 1024 * 1024;
const MAX_ZIP_TOTAL_BYTES = 40 * 1024 * 1024;

const IMAGE_EXTS: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

function extOf(name: string): string {
  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf(".");
  return dot === -1 ? "" : lower.slice(dot + 1);
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export async function extractDocument(
  fileName: string,
  mimeType: string,
  bytes: Uint8Array,
): Promise<ExtractedDoc> {
  const doc: ExtractedDoc = { parts: [], warnings: [] };
  const name = fileName || "document";
  try {
    await collect(extOf(name), mimeType, bytes, name, doc, 0);
  } catch (error) {
    doc.warnings.push(`${name}: could not be read (${describeError(error)}).`);
  }
  return doc;
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 160) : String(error).slice(0, 160);
}

function imageCount(doc: ExtractedDoc): number {
  return doc.parts.filter((p) => p.kind === "image").length;
}

function pushText(doc: ExtractedDoc, name: string, text: string) {
  const budget = MAX_TEXT_TOTAL - doc.parts.reduce((sum, p) => (p.kind === "text" ? sum + p.text.length : sum), 0);
  if (budget <= 0) {
    doc.warnings.push(`${name}: skipped — the document set is already very large.`);
    return;
  }
  const limited = text.length > Math.min(budget, MAX_TEXT_PER_PART)
    ? text.slice(0, Math.min(budget, MAX_TEXT_PER_PART))
    : text;
  if (limited.length < text.length) {
    doc.warnings.push(`${name}: very large — only the first ${limited.length.toLocaleString()} characters were read.`);
  }
  if (limited.trim()) doc.parts.push({ kind: "text", name, text: limited });
}

async function collect(
  ext: string,
  mime: string,
  bytes: Uint8Array,
  name: string,
  doc: ExtractedDoc,
  depth: number,
): Promise<void> {
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
    doc.parts.push({ kind: "image", name, dataUrl: `data:${imageMime};base64,${toBase64(bytes)}` });
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
    await collectZip(name, bytes, doc, depth);
    return;
  }
  collectText(name, bytes, doc);
}

async function collectPdf(name: string, bytes: Uint8Array, doc: ExtractedDoc): Promise<void> {
  try {
    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractText(pdf, { mergePages: false });
    const pages = Array.isArray(text) ? text : [text];
    const joined = pages
      .map((page) => page.trim())
      .filter(Boolean)
      .join("\n\n");
    if (joined.length >= 120) {
      pushText(doc, name, `PDF document, ${pages.length} page(s).\n\n${joined}`);
      return;
    }
    if (bytes.length <= MAX_PDF_INLINE_BYTES) {
      doc.warnings.push(
        `${name}: little or no selectable text (likely a scan or photo PDF) — reading it as a document instead.`,
      );
      doc.parts.push({ kind: "pdf", name, base64: toBase64(bytes) });
      return;
    }
    doc.warnings.push(`${name}: no readable text found and the file is too large to read as a document image.`);
  } catch (error) {
    doc.warnings.push(`${name}: could not be read as a PDF (${describeError(error)}).`);
  }
}

function collectExcel(name: string, bytes: Uint8Array, doc: ExtractedDoc): void {
  try {
    const workbook = XLSX.read(bytes, { type: "array" });
    const chunks: string[] = [];
    for (const sheetName of workbook.SheetNames.slice(0, 15)) {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) continue;
      const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false }).trim();
      if (!csv) continue;
      chunks.push(`## Sheet: ${sheetName}\n${csv.slice(0, 12_000)}`);
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

async function collectZip(
  name: string,
  bytes: Uint8Array,
  doc: ExtractedDoc,
  depth: number,
): Promise<void> {
  try {
    // The filter runs BEFORE inflating, so oversized entries (zip bombs) are
    // never decompressed into memory.
    let inflatedTotal = 0;
    const entries = unzipSync(bytes, {
      filter: (file) => {
        if (file.name.endsWith("/")) return false;
        if (file.originalSize > MAX_ZIP_ENTRY_BYTES) return false;
        if (inflatedTotal + file.originalSize > MAX_ZIP_TOTAL_BYTES) return false;
        inflatedTotal += file.originalSize;
        return true;
      },
    });
    let processed = 0;
    for (const [path, content] of Object.entries(entries)) {
      if (processed >= MAX_ZIP_ENTRIES) {
        doc.warnings.push(`${name}: more than ${MAX_ZIP_ENTRIES} files inside — only the first ${MAX_ZIP_ENTRIES} were read.`);
        break;
      }
      if (path.includes("__MACOSX") || path.split("/").some((seg) => seg.startsWith("."))) continue;
      const base = path.split("/").pop() ?? path;
      const ext = extOf(base);
      const entryName = depth > 0 ? base : `${name} → ${base}`;
      if (ext === "zip") {
        if (depth < 2) await collectZip(entryName, content, doc, depth + 1);
      } else {
        await collect(ext, "", content, entryName, doc, depth + 1);
      }
      processed += 1;
    }
    if (processed === 0) doc.warnings.push(`${name}: the archive appears to be empty or its files were too large.`);
  } catch (error) {
    doc.warnings.push(`${name}: could not be opened as a ZIP archive (${describeError(error)}).`);
  }
}

function collectText(name: string, bytes: Uint8Array, doc: ExtractedDoc): void {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes).trim();
  if (!text) return;
  const printable = text.replace(/[^\t\n\r\x20-\x7e\u00a0-\uffff]/g, "");
  if (printable.length < text.length * 0.8) {
    doc.warnings.push(`${name}: unsupported file format — no readable text could be extracted.`);
    return;
  }
  pushText(doc, name, text);
}
