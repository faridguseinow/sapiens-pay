import { moveImapMessages, parseImapMessageId, updateImapFlags } from "@/lib/mail/imap";
import { getMailSession } from "@/lib/mail/session";

export async function POST(request: Request) {
  const session = await getMailSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as {
    messageId?: string; folder?: string; isRead?: boolean; isStarred?: boolean;
  };
  if (!body.messageId || (body.folder && !["inbox", "archive", "trash", "spam"].includes(body.folder)))
    return Response.json({ error: "Invalid" }, { status: 400 });
  const parsed = parseImapMessageId(body.messageId);
  if (!parsed) return Response.json({ error: "Invalid" }, { status: 400 });
  await updateImapFlags(parsed.mailbox, [parsed.uid], {
    read: body.isRead, starred: body.isStarred,
  }, session);
  if (body.folder) {
    const destinations: Record<string, string> = {
      inbox: "INBOX", archive: "Archive", trash: "Trash", spam: "Junk",
    };
    const destination = destinations[body.folder];
    if (destination !== parsed.mailbox)
      await moveImapMessages(parsed.mailbox, [parsed.uid], destination, session);
  }
  return Response.json({ ok: true });
}
