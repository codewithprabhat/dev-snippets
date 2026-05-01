import "server-only";

export function requireEmailVerification(): boolean {
  return process.env.AUTH_REQUIRE_EMAIL_VERIFICATION?.toLowerCase() !== "false";
}
