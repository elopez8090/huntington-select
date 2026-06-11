import { escapeHtml } from "@/lib/email/escape-html";
import { getAppBaseUrl } from "@/lib/email/get-app-url";
import { sendEmail } from "@/lib/email/send-email";

function adminNotificationEmail(): string | null {
  const email = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  return email || null;
}

function emailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; line-height: 1.5; color: #1c1917; max-width: 560px; margin: 0 auto; padding: 24px;">
${bodyHtml}
<p style="margin-top: 32px; font-size: 13px; color: #78716c;">Huntington Select</p>
</body>
</html>`;
}

export async function notifyAdminProviderApplicationSubmitted(input: {
  applicantName: string;
  businessName: string;
  email: string;
  categoryName: string;
}): Promise<void> {
  const to = adminNotificationEmail();
  if (!to) {
    console.error(
      "[email] ADMIN_NOTIFICATION_EMAIL is not set; skipping admin application notice.",
    );
    return;
  }

  const base = getAppBaseUrl();
  const reviewUrl = `${base}/admin/provider-applications`;

  const html = emailShell(
    "New provider application",
    `<h1 style="font-size: 20px; margin: 0 0 16px;">New provider application</h1>
<p>A new provider application was submitted and is pending review.</p>
<table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
<tr><td style="padding: 6px 0; color: #78716c;">Applicant</td><td style="padding: 6px 0;"><strong>${escapeHtml(input.applicantName)}</strong></td></tr>
<tr><td style="padding: 6px 0; color: #78716c;">Business</td><td style="padding: 6px 0;">${escapeHtml(input.businessName)}</td></tr>
<tr><td style="padding: 6px 0; color: #78716c;">Email</td><td style="padding: 6px 0;">${escapeHtml(input.email)}</td></tr>
<tr><td style="padding: 6px 0; color: #78716c;">Category</td><td style="padding: 6px 0;">${escapeHtml(input.categoryName)}</td></tr>
</table>
<p><a href="${escapeHtml(reviewUrl)}" style="color: #92400e;">Review applications</a></p>`,
  );

  await sendEmail({
    to,
    subject: `New provider application: ${input.businessName}`,
    html,
  });
}

export async function notifyProviderApplicationApproved(input: {
  toEmail: string;
  businessName: string;
}): Promise<void> {
  const base = getAppBaseUrl();
  const loginUrl = `${base}/login`;
  const dashboardUrl = `${base}/provider/dashboard`;

  const html = emailShell(
    "Application approved",
    `<h1 style="font-size: 20px; margin: 0 0 16px;">Congratulations!</h1>
<p>Your application for <strong>${escapeHtml(input.businessName)}</strong> has been approved. You are now part of the Huntington Select provider network.</p>
<p>Sign in to manage your listing and keep your profile up to date.</p>
<p>
<a href="${escapeHtml(loginUrl)}" style="color: #92400e;">Sign in</a>
&nbsp;·&nbsp;
<a href="${escapeHtml(dashboardUrl)}" style="color: #92400e;">Provider dashboard</a>
</p>`,
  );

  await sendEmail({
    to: input.toEmail,
    subject: "Your Huntington Select provider application was approved",
    html,
  });
}

export async function notifyProviderApplicationRejected(input: {
  toEmail: string;
  contactName: string;
}): Promise<void> {
  const base = getAppBaseUrl();
  const applyUrl = `${base}/provider-apply`;
  const greeting = input.contactName.trim() || "there";

  const html = emailShell(
    "Application update",
    `<h1 style="font-size: 20px; margin: 0 0 16px;">Thank you for applying</h1>
<p>Hi ${escapeHtml(greeting)},</p>
<p>Thank you for your interest in Huntington Select. After careful review, we are unable to approve your application at this time.</p>
<p>We encourage you to apply again in the future if your business or services change. We appreciate you taking the time to apply.</p>
<p><a href="${escapeHtml(applyUrl)}" style="color: #92400e;">Apply again</a></p>`,
  );

  await sendEmail({
    to: input.toEmail,
    subject: "Update on your Huntington Select provider application",
    html,
  });
}
