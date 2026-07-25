"use server";

import { redirect } from "next/navigation";
import { sendSmtpMail } from "@/lib/mail/smtp";
import { deleteImapMessages, parseImapMessageId, verifyImapCredentials } from "@/lib/mail/imap";
import { clearMailSession, getMailSession, setMailSession } from "@/lib/mail/session";

export type MailActionState = { error?: string; success?: string } | undefined;

export async function mailLogin(_state: MailActionState, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "E-poçt və şifrəni daxil edin." };
  const normalized = email.toLowerCase();
  if (!normalized.endsWith("@sapiens-pay.com"))
    return { error: "Yalnız @sapiens-pay.com ünvanı ilə daxil olun." };
  try {
    await verifyImapCredentials({ email: normalized, password });
    await setMailSession({ email: normalized, password });
  } catch {
    return { error: "E-poçt və ya şifrə yanlışdır." };
  }
  redirect("/mail");
}

export async function mailLogout() {
  await clearMailSession();
  redirect("/mail/login");
}

export async function sendMail(_state: MailActionState, formData: FormData) {
  const mailSession = await getMailSession();
  if (!mailSession) redirect("/mail/login");

  const to = String(formData.get("to") ?? "")
    .split(/[;,]/)
    .map((value) => value.trim())
    .filter(Boolean);
  const subject = String(formData.get("subject") ?? "").trim();
  const text = String(formData.get("message") ?? "").trim();
  const html = String(formData.get("html") ?? "").trim().slice(0, 1_000_000);
  const fromName = String(formData.get("displayName") ?? "").trim().slice(0, 120);
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
  if (
    files.some((file) => file.size > 20 * 1024 * 1024) ||
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
  try {
    await sendSmtpMail({ to, cc, bcc, subject, text, html: html || undefined, attachments, fromName }, mailSession);
    const draft = draftId ? parseImapMessageId(draftId) : null;
    if (draft?.mailbox === "Drafts")
      await deleteImapMessages("Drafts", [draft.uid], mailSession);
    return { success: "Məktub göndərildi." };
  } catch (error) {
    return {
      error: `Məktub göndərilmədi: ${error instanceof Error ? error.message : "Naməlum xəta"}`,
    };
  }
}
