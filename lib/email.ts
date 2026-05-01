import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.EMAIL_FROM || "DevSnippet <onboarding@resend.dev>";

export async function sendVerificationEmail(opts: {
  to: string;
  name: string | null;
  verifyUrl: string;
}): Promise<void> {
  const { to, name, verifyUrl } = opts;
  const greeting = name ? `Hi ${name},` : "Hi,";

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your email for DevSnippet",
    text: [
      greeting,
      "",
      "Welcome to DevSnippet! Please verify your email by opening the link below:",
      verifyUrl,
      "",
      "This link expires in 24 hours. If you didn't create an account, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #111;">
        <h1 style="font-size: 20px; margin: 0 0 16px;">Verify your email</h1>
        <p style="margin: 0 0 12px;">${greeting}</p>
        <p style="margin: 0 0 16px;">Welcome to DevSnippet! Please confirm your email address to activate your account.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background: #111; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            Verify email
          </a>
        </p>
        <p style="margin: 0 0 8px; font-size: 13px; color: #555;">Or paste this URL into your browser:</p>
        <p style="margin: 0 0 16px; font-size: 13px; word-break: break-all;"><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p style="margin: 0; font-size: 12px; color: #888;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      </div>
    `.trim(),
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
