import { createClient } from "@/lib/supabase/server";
import {
  moveImapMessages,
  parseImapMessageId,
  updateImapFlags,
} from "@/lib/mail/imap";
import { isSelfHostedMailEnabled } from "@/lib/mail/self-hosted-config";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as {
    messageId?: string;
    folder?: string;
    isRead?: boolean;
    isStarred?: boolean;
  };
  if (
    !body.messageId ||
    (body.folder &&
      !["inbox", "archive", "trash", "spam"].includes(body.folder))
  )
    return Response.json({ error: "Invalid" }, { status: 400 });
  if (isSelfHostedMailEnabled()) {
    const parsed = parseImapMessageId(body.messageId);
    if (!parsed)
      return Response.json({ error: "Invalid" }, { status: 400 });
    await updateImapFlags(parsed.mailbox, [parsed.uid], {
      read: body.isRead,
      starred: body.isStarred,
    });
    if (body.folder) {
      const destinations: Record<string, string> = {
        inbox: "INBOX",
        archive: "Archive",
        trash: "Trash",
        spam: "Junk",
      };
      const destination = destinations[body.folder];
      if (destination && destination !== parsed.mailbox)
        await moveImapMessages(parsed.mailbox, [parsed.uid], destination);
    }
    return Response.json({ ok: true });
  }
  const payload = {
    user_id: auth.user.id,
    message_id: body.messageId,
    ...(body.folder ? { folder: body.folder } : {}),
    ...(typeof body.isRead === "boolean" ? { is_read: body.isRead } : {}),
    ...(typeof body.isStarred === "boolean"
      ? { is_starred: body.isStarred }
      : {}),
  };
  const { error } = await supabase
    .from("mail_states")
    .upsert(payload, { onConflict: "user_id,message_id" });
  return error
    ? Response.json({ error: error.message }, { status: 500 })
    : Response.json({ ok: true });
}
