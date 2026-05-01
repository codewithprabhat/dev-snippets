import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { consumeVerificationToken } from "@/lib/auth/verification-tokens";

type SearchParams = Promise<{ token?: string }>;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token } = await searchParams;

  type ErrorState = "missing" | "invalid" | "expired";
  let state: ErrorState;

  if (!token) {
    state = "missing";
  } else {
    const result = await consumeVerificationToken(token);
    if (result.ok) {
      await db.user.update({
        where: { email: result.email },
        data: { emailVerified: new Date() },
      });
      redirect("/sign-in?verified=1");
    }
    state = result.reason;
  }

  const messages: Record<ErrorState, { title: string; body: string }> = {
    missing: {
      title: "Missing token",
      body: "This link is missing a verification token. Please use the link from your email.",
    },
    invalid: {
      title: "Invalid link",
      body: "This verification link is no longer valid. It may have already been used.",
    },
    expired: {
      title: "Link expired",
      body: "This verification link has expired. Please register again to receive a new link.",
    },
  };

  const { title, body } = messages[state];

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {body}
      </p>
      <div className="mt-6 flex flex-col gap-2 text-center text-sm">
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
        <Link
          href="/register"
          className="font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          Create a new account
        </Link>
      </div>
    </div>
  );
}
