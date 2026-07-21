import { listImapFolders } from "@/lib/mail/imap";
import { verifySmtpConnection } from "@/lib/mail/smtp";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [smtp, folders] = await Promise.all([verifySmtpConnection(), listImapFolders()]);
    if (!smtp || !folders.some((folder) => folder.path === "INBOX")) throw new Error("SMTP/IMAP validation failed");
    return Response.json({ ok: true, checkedAt: new Date().toISOString() });
  } catch (error) {
    await sendTelegramMessage(
      `🔴 <b>Sapiens Mail xəbərdarlığı</b>\n\nSMTP/IMAP yoxlaması uğursuz oldu.\n${error instanceof Error ? error.message : "Naməlum xəta"}`,
    );
    return Response.json({ ok: false }, { status: 503 });
  }
}
