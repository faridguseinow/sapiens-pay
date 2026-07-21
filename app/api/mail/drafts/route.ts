import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/server";
import {
  appendImapMessage,
  deleteImapMessages,
  listImapDrafts,
  parseImapMessageId,
} from "@/lib/mail/imap";
import { isSelfHostedMailEnabled } from "@/lib/mail/self-hosted-config";
import { getMailSession } from "@/lib/mail/session";

async function legacyUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

export async function GET() {
  if (isSelfHostedMailEnabled()) {
    const session = await getMailSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json(await listImapDrafts(session));
  }
  const { supabase, user } = await legacyUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const result = await supabase.from("mail_drafts").select("*").order("updated_at", { ascending: false });
  return result.error ? Response.json({ error: result.error.message }, { status: 500 }) : Response.json(result.data);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    id?: string; recipients?: string[]; cc?: string[]; bcc?: string[]; subject?: string; body?: string;
  };
  if (isSelfHostedMailEnabled()) {
    const session = await getMailSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const builder = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" });
    const built = await builder.sendMail({
      from: session.email,
      to: body.recipients || [],
      cc: body.cc || [],
      bcc: body.bcc || [],
      subject: (body.subject || "").slice(0, 998),
      text: body.body || "",
      date: new Date(),
      headers: { "X-Sapiens-Draft": "1" },
    });
    if (!Buffer.isBuffer(built.message)) return Response.json({ error: "Draft failed" }, { status: 500 });
    await appendImapMessage("Drafts", built.message, ["\\Draft", "\\Seen"], session);
    const previous = body.id ? parseImapMessageId(body.id) : null;
    if (previous?.mailbox === "Drafts") await deleteImapMessages("Drafts", [previous.uid], session);
    const drafts = await listImapDrafts(session);
    const saved = drafts[0];
    return Response.json(saved || { ...body, id: `Drafts:${Date.now()}`, updated_at: new Date().toISOString() });
  }
  const { supabase, user } = await legacyUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const payload = { user_id: user.id, recipients: body.recipients ?? [], cc: body.cc ?? [], bcc: body.bcc ?? [], subject: (body.subject ?? "").slice(0, 998), body: body.body ?? "", updated_at: new Date().toISOString() };
  const result = body.id ? await supabase.from("mail_drafts").update(payload).eq("id", body.id).select().single() : await supabase.from("mail_drafts").insert(payload).select().single();
  return result.error ? Response.json({ error: result.error.message }, { status: 500 }) : Response.json(result.data);
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Invalid" }, { status: 400 });
  if (isSelfHostedMailEnabled()) {
    const session = await getMailSession();
    const parsed = parseImapMessageId(id);
    if (!session || parsed?.mailbox !== "Drafts") return Response.json({ error: "Unauthorized" }, { status: 401 });
    await deleteImapMessages("Drafts", [parsed.uid], session);
    return Response.json({ ok: true });
  }
  const { supabase, user } = await legacyUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const result = await supabase.from("mail_drafts").delete().eq("id", id);
  return result.error ? Response.json({ error: result.error.message }, { status: 500 }) : Response.json({ ok: true });
}
