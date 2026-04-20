import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";

type SearchParams = Promise<{
  callbackUrl?: string;
  error?: string;
  registered?: string;
}>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { callbackUrl, error, registered } = await searchParams;

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your DevStash account
        </p>
      </div>

      {registered && (
        <p className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-500">
          Account created. Please sign in.
        </p>
      )}

      <SignInForm callbackUrl={callbackUrl} initialError={error} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
