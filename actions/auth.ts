"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { requireEmailVerification } from "@/lib/auth/config";

export type SignInState = { error: string } | undefined;

export async function credentialsSignInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  const password = (formData.get("password") as string) ?? "";
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (requireEmailVerification()) {
    const user = await db.user.findUnique({
      where: { email },
      select: { password: true, emailVerified: true },
    });
    if (user?.password && !user.emailVerified) {
      const passwordOk = await bcrypt.compare(password, user.password);
      if (passwordOk) {
        return {
          error:
            "Please verify your email before signing in. Check your inbox for the verification link.",
        };
      }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password" };
      }
      return { error: "Sign in failed. Please try again." };
    }
    throw error;
  }
}

export async function githubSignInAction(callbackUrl?: string) {
  await signIn("github", { redirectTo: callbackUrl || "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/sign-in" });
}
