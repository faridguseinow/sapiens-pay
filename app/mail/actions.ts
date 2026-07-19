"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMailFrom, getResend } from "@/lib/resend";

export type MailActionState = { error?: string; success?: string } | undefined;

export async function mailLogin(_state: MailActionState, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "E-poçt və şifrəni daxil edin." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-poçt və ya şifrə yanlışdır." };
  redirect("/mail");
}

export async function mailLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/mail/login");
}

export async function sendMail(_state: MailActionState, formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/mail/login");

  const to = String(formData.get("to") ?? "")
    .split(/[;,]/)
    .map((value) => value.trim())
    .filter(Boolean);
  const subject = String(formData.get("subject") ?? "").trim();
  const text = String(formData.get("message") ?? "").trim();
  const cc = String(formData.get("cc") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const bcc = String(formData.get("bcc") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const draftId = String(formData.get("draftId") ?? "");
  const files = formData
    .getAll("attachments")
    .filter((item): item is File => item instanceof File && item.size > 0);
  const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
  if (
    !to.length ||
    !subject ||
    !text ||
    !to.every(isEmail) ||
    !cc.every(isEmail) ||
    !bcc.every(isEmail)
  ) {
    return { error: "Alıcı, mövzu və mesajı düzgün doldurun." };
  }
  let resend;
  try {
    resend = getResend();
  } catch {
    return { error: "Mail xidməti hələ qoşulmayıb." };
  }
  if (
    files.some((file) => file.size > 10 * 1024 * 1024) ||
    files.reduce((sum, file) => sum + file.size, 0) > 20 * 1024 * 1024
  ) {
    return { error: "Fayllar ümumilikdə 20 MB-dan böyük ola bilməz." };
  }
  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );
  const { data: sent, error } = await resend.emails.send({
    from: getMailFrom(),
    to,
    cc,
    bcc,
    subject,
    text,
    attachments,
  });
  if (error) return { error: `Məktub göndərilmədi: ${error.message}` };
  if (sent?.id) {
    await supabase.from("mail_messages").upsert(
      {
        external_id: sent.id,
        direction: "outbound",
        thread_key:
          subject
            .replace(/^\s*(re|fw|fwd)\s*:\s*/i, "")
            .trim()
            .toLocaleLowerCase() || sent.id,
        sender: getMailFrom(),
        recipients: to,
        cc,
        bcc,
        subject,
        text_body: text,
        received_at: new Date().toISOString(),
        delivery_status: "queued",
      },
      { onConflict: "external_id" },
    );
  }
  if (draftId) await supabase.from("mail_drafts").delete().eq("id", draftId);
  return { success: "Məktub göndərildi." };
}
