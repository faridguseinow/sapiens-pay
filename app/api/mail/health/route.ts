import { listImapFolders } from "@/lib/mail/imap";
import { getMailSession } from "@/lib/mail/session";
import { verifySmtpConnection } from "@/lib/mail/smtp";

export async function GET(request: Request) {
  const session = await getMailSession();
  const cronSecret = process.env.CRON_SECRET;
  const monitorAuthorized = Boolean(cronSecret) && request.headers.get("authorization") === `Bearer ${cronSecret}`;
  if (!session && !monitorAuthorized)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [smtp, folders] = await Promise.all([
      verifySmtpConnection(), listImapFolders(session || undefined),
    ]);
    return Response.json({
      backend: "self-hosted", smtpOk: smtp, imapOk: true,
      folders: folders.map((folder) => folder.path),
    });
  } catch (error) {
    return Response.json({
      backend: "self-hosted", smtpOk: false, imapOk: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 503 });
  }
}
