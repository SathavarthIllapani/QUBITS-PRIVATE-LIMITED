/** Password rules for sign-up and password reset. Sign-in is never blocked by these. */
export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 72;

export const PASSWORD_HINT = `Use at least ${MIN_PASSWORD_LENGTH} characters, with letters and numbers.`;

const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "1234567890",
  "12345678910",
  "qwertyuiop",
  "qwerty12345",
  "letmein123",
  "welcome123",
  "admin12345",
  "iloveyou123",
  "abc1234567",
  "qubits12345",
]);

/** Returns a user-facing problem, or null when the password is acceptable. */
export function validatePassword(password: string, email = ""): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters long.`;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include both letters and numbers.";
  }
  const lower = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) {
    return "That password is too common — choose something less guessable.";
  }
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (local.length >= 4 && lower.includes(local)) {
    return "Password must not contain your email name.";
  }
  if (/^(.)\1+$/.test(password)) {
    return "Password must not be a single repeated character.";
  }
  return null;
}
