import { createClient } from "@/lib/supabase/server";

async function userClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

export async function GET() {
  const { supabase, user } = await userClient();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const result = await supabase
    .from("mail_drafts")
    .select("*")
    .order("updated_at", { ascending: false });
  return result.error
    ? Response.json({ error: result.error.message }, { status: 500 })
    : Response.json(result.data);
}

export async function POST(request: Request) {
  const { supabase, user } = await userClient();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as {
    id?: string;
    recipients?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    body?: string;
    replyToMessageId?: string;
  };
  const payload = {
    user_id: user.id,
    recipients: body.recipients ?? [],
    cc: body.cc ?? [],
    bcc: body.bcc ?? [],
    subject: (body.subject ?? "").slice(0, 998),
    body: body.body ?? "",
    reply_to_message_id: body.replyToMessageId ?? null,
    updated_at: new Date().toISOString(),
  };
  const query = body.id
    ? supabase
        .from("mail_drafts")
        .update(payload)
        .eq("id", body.id)
        .select()
        .single()
    : supabase.from("mail_drafts").insert(payload).select().single();
  const result = await query;
  return result.error
    ? Response.json({ error: result.error.message }, { status: 500 })
    : Response.json(result.data);
}

export async function DELETE(request: Request) {
  const { supabase, user } = await userClient();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Invalid" }, { status: 400 });
  const result = await supabase.from("mail_drafts").delete().eq("id", id);
  return result.error
    ? Response.json({ error: result.error.message }, { status: 500 })
    : Response.json({ ok: true });
}
