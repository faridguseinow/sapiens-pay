import { createClient } from "@/lib/supabase/server";
import { getResend } from "@/lib/resend";
import { getImapMessage, listImapMessages } from "@/lib/mail/imap";
import { isSelfHostedMailEnabled } from "@/lib/mail/self-hosted-config";

const normalize = (subject: string) =>
  subject
    .replace(/^\s*(re|fw|fwd)\s*:\s*/i, "")
    .trim()
    .toLocaleLowerCase();

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const subject = new URL(request.url).searchParams.get("subject") || "";
  const key = normalize(subject);
  if (isSelfHostedMailEnabled()) {
    const folders = ["INBOX", "Sent", "Archive", "Junk", "Trash"];
    const lists = await Promise.all(
      folders.map((mailbox) => listImapMessages(mailbox, { limit: 100 })),
    );
    const matches = lists
      .flat()
      .filter((item) => normalize(item.subject) === key)
      .slice(0, 20);
    const messages = await Promise.all(
      matches.map((item) => getImapMessage(item.mailbox, item.uid)),
    );
    return Response.json(
      messages
        .filter((item) => item !== null)
        .map((item) => ({
          id: item.id,
          from: item.from,
          to: item.to,
          subject: item.subject,
          created_at: item.createdAt,
          text: item.text,
          html: item.html,
          cc: item.cc,
          reply_to: item.replyTo,
          attachments: item.attachments.map((file, index) => ({
            id: String(index),
            filename: file.filename,
            size: file.size,
            download_url: `/api/mail/attachment?message=${encodeURIComponent(item.id)}&index=${index}`,
          })),
        }))
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
    );
  }
  const resend = getResend();
  const [inbox, sent] = await Promise.all([
    resend.emails.receiving.list({ limit: 100 }),
    resend.emails.list({ limit: 100 }),
  ]);
  const incoming = (inbox.data?.data ?? [])
    .filter((item) => normalize(item.subject) === key)
    .slice(0, 20);
  const outgoing = (sent.data?.data ?? [])
    .filter((item) => normalize(item.subject) === key)
    .slice(0, 20);
  const details = await Promise.all([
    ...incoming.map(async (item) => {
      const value = await resend.emails.receiving.get(item.id);
      return value.data
        ? { ...value.data, direction: "inbound" as const }
        : null;
    }),
    ...outgoing.map(async (item) => {
      const value = await resend.emails.get(item.id);
      return value.data
        ? { ...value.data, direction: "outbound" as const, attachments: [] }
        : null;
    }),
  ]);
  return Response.json(
    details
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(a!.created_at).getTime() - new Date(b!.created_at).getTime(),
      ),
  );
}
