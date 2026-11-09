/**
 * Per-user rate limiting backed by the database (no extra tables): counts the
 * rows a user created in a time window. Works across serverless instances,
 * unlike in-memory counters. Row-level security scopes counts to the caller.
 */
export interface RateRule {
  windowMs: number;
  max: number;
  /** Shown to the user, e.g. "10 analyses per 10 minutes". */
  label: string;
}

export const ANALYZE_RATE_LIMITS: RateRule[] = [
  { windowMs: 10 * 60_000, max: 10, label: "10 document analyses per 10 minutes" },
  { windowMs: 24 * 60 * 60_000, max: 100, label: "100 document analyses per day" },
];

export const TREND_RATE_LIMITS: RateRule[] = [
  { windowMs: 10 * 60_000, max: 5, label: "5 trend reviews per 10 minutes" },
  { windowMs: 24 * 60 * 60_000, max: 30, label: "30 trend reviews per day" },
];

/**
 * Returns a user-facing message when a rule is exceeded, otherwise null.
 * `countSince` returns how many rows the user created since the given ISO time,
 * or null if it could not be determined (the check then fails open).
 */
export async function exceededRateLimit(
  countSince: (sinceIso: string) => Promise<number | null>,
  rules: RateRule[],
  now: number = Date.now(),
): Promise<string | null> {
  for (const rule of rules) {
    const used = await countSince(new Date(now - rule.windowMs).toISOString());
    if (used !== null && used >= rule.max) {
      return `Limit reached (${rule.label}). Please wait a little while and try again.`;
    }
  }
  return null;
}
