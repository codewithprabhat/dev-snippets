import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import {
  buildVerificationUrl,
  createVerificationToken,
} from "@/lib/auth/verification-tokens";
import { requireEmailVerification } from "@/lib/auth/config";

type RegisterBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getOrigin(request: Request): string {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  if (host) {
    const proto = forwardedProto ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { success: false, error: "name, email, password and confirmPassword are required" },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { success: false, error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { success: false, error: "Passwords do not match" },
      { status: 400 },
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const verificationRequired = requireEmailVerification();

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashed,
      emailVerified: verificationRequired ? null : new Date(),
    },
    select: { id: true, name: true, email: true },
  });

  if (verificationRequired) {
    try {
      const token = await createVerificationToken(email);
      const verifyUrl = buildVerificationUrl(getOrigin(request), token);
      await sendVerificationEmail({ to: email, name: user.name, verifyUrl });
    } catch (err) {
      console.error("[register] failed to send verification email:", err);
      await db.user.delete({ where: { id: user.id } }).catch(() => {});
      return NextResponse.json(
        { success: false, error: "Could not send verification email. Please try again." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { success: true, user, requiresVerification: verificationRequired },
    { status: 201 },
  );
}
