import { getImapMessage, parseImapMessageId } from "@/lib/mail/imap";
import { getMailSession } from "@/lib/mail/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getMailSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = parseImapMessageId(id);
  if (!parsed) return Response.json({ error: "Məktub tapılmadı" }, { status: 404 });
  const message = await getImapMessage(parsed.mailbox, parsed.uid, session);
  if (!message) return Response.json({ error: "Məktub tapılmadı" }, { status: 404 });
  return Response.json({
    id: message.id, from: message.from, to: message.to, subject: message.subject,
    created_at: message.createdAt, text: message.text, html: message.html,
    cc: message.cc, reply_to: message.replyTo,
    attachments: message.attachments.map((file, index) => ({
      id: String(index), filename: file.filename, size: file.size,
      download_url: `/api/mail/attachment?message=${encodeURIComponent(message.id)}&index=${index}`,
    })),
  });
}
