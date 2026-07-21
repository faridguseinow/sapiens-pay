import { getImapMessage, listImapMessages } from "@/lib/mail/imap";
import { getMailSession } from "@/lib/mail/session";

const normalize = (subject: string) =>
  subject.replace(/^\s*(re|fw|fwd)\s*:\s*/i, "").trim().toLocaleLowerCase();

export async function GET(request: Request) {
  const session = await getMailSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const key = normalize(new URL(request.url).searchParams.get("subject") || "");
  const folders = ["INBOX", "Sent", "Archive", "Junk", "Trash"];
  const lists = await Promise.all(
    folders.map((mailbox) => listImapMessages(mailbox, { limit: 100 }, session)),
  );
  const matches = lists.flat().filter((item) => normalize(item.subject) === key).slice(0, 20);
  const messages = await Promise.all(
    matches.map((item) => getImapMessage(item.mailbox, item.uid, session)),
  );
  return Response.json(
    messages.filter((item) => item !== null).map((item) => ({
      id: item.id, from: item.from, to: item.to, subject: item.subject,
      created_at: item.createdAt, text: item.text, html: item.html,
      cc: item.cc, reply_to: item.replyTo,
      attachments: item.attachments.map((file, index) => ({
        id: String(index), filename: file.filename, size: file.size,
        download_url: `/api/mail/attachment?message=${encodeURIComponent(item.id)}&index=${index}`,
      })),
    })).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
  );
}
