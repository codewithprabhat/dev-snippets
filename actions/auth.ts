"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

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
