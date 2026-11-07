/**
 * Server-only AI Gateway helpers.
 * Supports OpenAI and OpenAI-compatible providers.
 */
import { createOpenAI } from "@ai-sdk/openai";

export function getAiApiKey(): string | undefined {
  return process.env["OPENAI_API_KEY"] || process.env["AI_API_KEY"];
}

export function createResponsesProvider(preferredModel?: string) {
  const apiKey = getAiApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const baseURL = process.env["OPENAI_BASE_URL"] || process.env["AI_GATEWAY_URL"];

  const rawModel = process.env["AI_MODEL"] || preferredModel || "gpt-4o-mini";
  const modelName = rawModel.replace(/^openai\//, "");

  const provider = createOpenAI({
    baseURL,
    apiKey,
  });

  const isResponsesModel =
    typeof provider.responses === "function" &&
    (rawModel.includes("astra") || rawModel.startsWith("responses/"));

  const model = isResponsesModel
    ? provider.responses(rawModel)
    : provider(modelName);

  return { model, runIdFetch: { fetch } };
}

/** Maps a thrown AI SDK / gateway error onto a user-safe message. */
export function toUserSafeAiError(error: unknown): string {
  const name =
    error != null && typeof error === "object" && "name" in error
      ? String((error as { name: unknown }).name)
      : "";
  const statusRaw =
    error != null && typeof error === "object" && "statusCode" in error
      ? Number((error as { statusCode: unknown }).statusCode)
      : undefined;
  const status = Number.isFinite(statusRaw) ? (statusRaw as number) : undefined;

  if (status === 401) return "Invalid AI API key. Please check your OPENAI_API_KEY in the environment.";
  if (status === 402) return "AI allowance or credits are depleted. Please check your AI account balance.";
  if (status === 403) return "The AI provider refused this request. Check your permissions or model access.";
  if (status === 429) return "The AI service rate limit was reached — please try again in a moment.";
  if (status !== undefined && status >= 500) return "The AI service had a temporary problem — please try again.";

  if (name === "AbortError") return "The analysis was cancelled.";
  console.error("AI service call failed:", error);
  return "The AI service could not analyse this document. Please try again.";
}
