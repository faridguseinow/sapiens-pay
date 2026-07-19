import { Resend } from "resend";

function cleanSecret(value: string | undefined, key: string) {
  const cleaned = (value ?? "")
    .trim()
    .replace(new RegExp(`^${key}\\s*=\\s*`, "i"), "")
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2")
    .trim();
  if (!cleaned) throw new Error(`${key} is not configured`);
  return cleaned;
}

export const getResend = () =>
  new Resend(cleanSecret(process.env.RESEND_API_KEY, "RESEND_API_KEY"));
export const getWebhookSecret = () =>
  cleanSecret(process.env.RESEND_WEBHOOK_SECRET, "RESEND_WEBHOOK_SECRET");
export function getMailFrom() {
  return (process.env.MAIL_FROM || "Sapiens Pay <info@sapiens-pay.com>")
    .trim()
    .replace(/^MAIL_FROM\s*=\s*/i, "")
    .replace(/^(["'])(.*)\1$/, "$2")
    .trim();
}
