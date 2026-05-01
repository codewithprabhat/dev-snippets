import { randomBytes } from "crypto";
import { db } from "@/lib/db";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export type ConsumeResult =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid" | "expired" };

export async function createVerificationToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  await db.verificationToken.deleteMany({ where: { identifier: email } });
  await db.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  return token;
}

export async function consumeVerificationToken(token: string): Promise<ConsumeResult> {
  const record = await db.verificationToken.findUnique({ where: { token } });
  if (!record) return { ok: false, reason: "invalid" };

  await db.verificationToken.delete({ where: { token } });

  if (record.expires < new Date()) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true, email: record.identifier };
}

export function buildVerificationUrl(origin: string, token: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}/verify-email?token=${encodeURIComponent(token)}`;
}
