import { createClient } from "@/lib/supabase/server";
import { getResend } from "@/lib/resend";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
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
