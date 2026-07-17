import { createClient } from "@supabase/supabase-js";
import { Resend, type WebhookEventPayload } from "resend";

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service configuration missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

function threadKey(
  subject: string,
  headers: Record<string, string> | null,
  messageId: string,
) {
  const references =
    headers?.references ||
    headers?.References ||
    headers?.["in-reply-to"] ||
    headers?.["In-Reply-To"];
  if (references) return references.trim().split(/\s+/)[0];
  const normalized = subject
    .replace(/^\s*(re|fw|fwd)\s*:\s*/i, "")
    .trim()
    .toLocaleLowerCase();
  return normalized || messageId;
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret)
    return Response.json({ error: "Webhook not configured" }, { status: 503 });
  const payload = await request.text();
  const resend = new Resend(process.env.RESEND_API_KEY);
  let event: WebhookEventPayload;
  try {
    event = resend.webhooks.verify({
      payload,
      webhookSecret: secret,
      headers: {
        id: request.headers.get("svix-id") || "",
        timestamp: request.headers.get("svix-timestamp") || "",
        signature: request.headers.get("svix-signature") || "",
      },
    });
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }
  if (event.type !== "email.received") {
    if (event.type.startsWith("email.") && "email_id" in event.data) {
      await admin()
        .from("mail_messages")
        .update({ delivery_status: event.type.replace("email.", "") })
        .eq("external_id", event.data.email_id);
    }
    return Response.json({ ok: true });
  }
  const received = await resend.emails.receiving.get(event.data.email_id);
  if (!received.data)
    return Response.json({ error: "Email unavailable" }, { status: 502 });
  const mail = received.data;
  const { error } = await admin()
    .from("mail_messages")
    .upsert(
      {
        external_id: mail.id,
        direction: "inbound",
        message_id: mail.message_id,
        thread_key: threadKey(mail.subject, mail.headers, mail.message_id),
        sender: mail.from,
        recipients: mail.to,
        cc: mail.cc ?? [],
        bcc: mail.bcc ?? [],
        reply_to: mail.reply_to ?? [],
        subject: mail.subject ?? "",
        text_body: mail.text,
        html_body: mail.html,
        attachments: mail.attachments,
        headers: mail.headers ?? {},
        received_at: mail.created_at,
      },
      { onConflict: "external_id" },
    );
  return error
    ? Response.json({ error: error.message }, { status: 500 })
    : Response.json({ ok: true });
}
