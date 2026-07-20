import { createClient } from "@/lib/supabase/server";
import { getImapMessage, parseImapMessageId } from "@/lib/mail/imap";
import { isSelfHostedMailEnabled } from "@/lib/mail/self-hosted-config";

const safeFilename = (value: string) =>
  value.replace(/[\r\n"\\/]/g, "_").slice(0, 180) || "attachment";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSelfHostedMailEnabled())
    return Response.json({ error: "Not available" }, { status: 404 });
  const url = new URL(request.url);
  const parsed = parseImapMessageId(url.searchParams.get("message") || "");
  const index = Number(url.searchParams.get("index"));
  if (!parsed || !Number.isSafeInteger(index) || index < 0)
    return Response.json({ error: "Invalid" }, { status: 400 });
  const message = await getImapMessage(parsed.mailbox, parsed.uid);
  const attachment = message?.attachments[index];
  if (!attachment)
    return Response.json({ error: "Fayl tapılmadı" }, { status: 404 });
  const content = Uint8Array.from(attachment.content).buffer;
  return new Response(content, {
    headers: {
      "content-type": attachment.contentType || "application/octet-stream",
      "content-length": String(attachment.size),
      "content-disposition": `attachment; filename="${safeFilename(attachment.filename)}"`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
