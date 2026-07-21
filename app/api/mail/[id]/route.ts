import { createClient } from "@/lib/supabase/server";
import { getResend } from "@/lib/resend";
import { getImapMessage, parseImapMessageId } from "@/lib/mail/imap";
import { isSelfHostedMailEnabled } from "@/lib/mail/self-hosted-config";
import { getMailSession } from "@/lib/mail/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const selfHosted = isSelfHostedMailEnabled();
  const mailSession = selfHosted ? await getMailSession() : null;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (selfHosted ? !mailSession : !auth?.claims)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (selfHosted) {
    const parsedId = parseImapMessageId(id);
    if (!parsedId)
      return Response.json({ error: "Məktub tapılmadı" }, { status: 404 });
    const message = await getImapMessage(parsedId.mailbox, parsedId.uid, mailSession!);
    if (!message)
      return Response.json({ error: "Məktub tapılmadı" }, { status: 404 });
    return Response.json({
      id: message.id,
      from: message.from,
      to: message.to,
      subject: message.subject,
      created_at: message.createdAt,
      text: message.text,
      html: message.html,
      cc: message.cc,
      reply_to: message.replyTo,
      attachments: message.attachments.map((file, index) => ({
        id: String(index),
        filename: file.filename,
        size: file.size,
        download_url: `/api/mail/attachment?message=${encodeURIComponent(message.id)}&index=${index}`,
      })),
    });
  }
  const resend = getResend();
  if (new URL(request.url).searchParams.get("direction") === "sent") {
    const sent = await resend.emails.get(id);
    if (sent.error || !sent.data)
      return Response.json({ error: "Məktub tapılmadı" }, { status: 404 });
    return Response.json({
      ...sent.data,
      cc: sent.data.cc ?? [],
      reply_to: sent.data.reply_to ?? [],
      attachments: [],
    });
  }
  const result = await resend.emails.receiving.get(id);
  if (result.error || !result.data)
    return Response.json({ error: "Məktub tapılmadı" }, { status: 404 });
  const attachments = await Promise.all(
    result.data.attachments.map(async (file) => {
      const item = await resend.emails.receiving.attachments.get({
        emailId: id,
        id: file.id,
      });
      return { ...file, download_url: item.data?.download_url ?? null };
    }),
  );
  return Response.json({ ...result.data, attachments });
}
