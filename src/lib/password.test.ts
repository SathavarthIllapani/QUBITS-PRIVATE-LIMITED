import { describe, expect, it } from "vitest";

import { validatePassword } from "@/lib/password";

describe("validatePassword", () => {
  it("rejects short passwords", () => {
    expect(validatePassword("abc123")).toMatch(/at least 10/);
  });
  it("requires letters and numbers", () => {
    expect(validatePassword("abcdefghijkl")).toMatch(/letters and numbers/);
    expect(validatePassword("123456789012")).toMatch(/letters and numbers/);
  });
  it("rejects common passwords and email-based passwords", () => {
    expect(validatePassword("Password123")).toMatch(/too common/);
    expect(validatePassword("sathavarth2026x", "sathavarth@example.com")).toMatch(/email name/);
  });
  it("accepts a reasonable password", () => {
    expect(validatePassword("blue-Lab-rat-482")).toBeNull();
  });
});
