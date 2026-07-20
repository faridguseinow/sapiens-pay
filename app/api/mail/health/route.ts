import { createClient } from "@/lib/supabase/server";
import { getResend } from "@/lib/resend";
import { createHash } from "node:crypto";
import { listImapFolders } from "@/lib/mail/imap";
import { verifySmtpConnection } from "@/lib/mail/smtp";
import { isSelfHostedMailEnabled } from "@/lib/mail/self-hosted-config";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const cronSecret = process.env.CRON_SECRET;
  const monitorAuthorized =
    Boolean(cronSecret) &&
    request.headers.get("authorization") === `Bearer ${cronSecret}`;
  if (!data?.claims && !monitorAuthorized)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (isSelfHostedMailEnabled()) {
    try {
      const [smtp, folders] = await Promise.all([
        verifySmtpConnection(),
        listImapFolders(),
      ]);
      return Response.json({
        backend: "self-hosted",
        smtpOk: smtp,
        imapOk: true,
        folders: folders.map((folder) => folder.path),
      });
    } catch (error) {
      return Response.json(
        {
          backend: "self-hosted",
          smtpOk: false,
          imapOk: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 503 },
      );
    }
  }
  const raw = process.env.RESEND_API_KEY ?? "";
  const normalized = raw
    .trim()
    .replace(/^RESEND_API_KEY\s*=\s*/i, "")
    .replace(/^(["'])(.*)\1$/, "$2")
    .trim();
  const result = await getResend().domains.list();
  const inbound = await getResend().emails.receiving.list({ limit: 1 });
  const fingerprint = createHash("sha256").update(normalized).digest("hex");
  const expected = process.env.RESEND_API_KEY_FINGERPRINT ?? "";
  return Response.json({
    configured: Boolean(normalized),
    prefixOk: normalized.startsWith("re_"),
    length: normalized.length,
    fingerprintMatches: Boolean(expected) && fingerprint === expected,
    apiOk: !result.error,
    receivingApiOk: !inbound.error,
    receivingError: inbound.error?.message ?? null,
  });
}
