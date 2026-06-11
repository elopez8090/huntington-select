import { Resend } from "resend";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
};

const DEFAULT_FROM = "Huntington Select <onboarding@resend.dev>";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

/**
 * Sends email via Resend. Logs errors and never throws.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.error("[email] RESEND_API_KEY is not set; skipping send.", {
      subject: input.subject,
    });
    return;
  }

  const from = getFromAddress();

  try {
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      console.error("[email] Resend returned an error:", error, {
        subject: input.subject,
      });
    }
  } catch (err) {
    console.error("[email] Failed to send:", err, { subject: input.subject });
  }
}
