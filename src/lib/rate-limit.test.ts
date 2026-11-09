import { describe, expect, it } from "vitest";

import { exceededRateLimit, type RateRule } from "@/lib/rate-limit.server";

const rules: RateRule[] = [
  { windowMs: 60_000, max: 2, label: "2 per minute" },
  { windowMs: 3_600_000, max: 5, label: "5 per hour" },
];

describe("exceededRateLimit", () => {
  it("allows usage under every limit", async () => {
    expect(await exceededRateLimit(async () => 1, rules)).toBeNull();
  });
  it("blocks when a window is full and names the rule", async () => {
    const message = await exceededRateLimit(async () => 2, rules);
    expect(message).toContain("2 per minute");
  });
  it("checks each window separately", async () => {
    const now = Date.now();
    const message = await exceededRateLimit(
      async (since) => (now - new Date(since).getTime() > 60_000 ? 5 : 0),
      rules,
      now,
    );
    expect(message).toContain("5 per hour");
  });
  it("fails open when the count is unavailable", async () => {
    expect(await exceededRateLimit(async () => null, rules)).toBeNull();
  });
});
