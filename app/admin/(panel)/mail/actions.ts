"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  assertMailcowSuccess,
  changeMailcowMailboxPassword,
  createMailcowMailbox,
  deleteMailcowMailbox,
  setMailcowMailboxActive,
} from "@/lib/mail/mailcow";

const DOMAIN = "sapiens-pay.com";
const PRIMARY_MAILBOX = "info@sapiens-pay.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/admin/login");
}

function mailbox(value: FormDataEntryValue | null) {
  const username = String(value ?? "").trim().toLowerCase();
  if (!username.endsWith(`@${DOMAIN}`)) {
    throw new Error("Yanlış mailbox ünvanı.");
  }
  return username;
}

function password(value: FormDataEntryValue | null) {
  const result = String(value ?? "");
  if (
    result.length < 12 ||
    !/[a-z]/.test(result) ||
    !/[A-Z]/.test(result) ||
    !/[0-9]/.test(result) ||
    !/[^A-Za-z0-9]/.test(result)
  ) {
    throw new Error(
      "Şifrə minimum 12 simvol, böyük/kiçik hərf, rəqəm və xüsusi işarə içərməlidir.",
    );
  }
  return result;
}

function done(message: string) {
  revalidatePath("/admin/mail");
  redirect(`/admin/mail?success=${encodeURIComponent(message)}`);
}

function failed() {
  redirect(
    `/admin/mail?error=${encodeURIComponent(
      "Əməliyyat tamamlanmadı. Məlumatları yoxlayın.",
    )}`,
  );
}

export async function createMailbox(formData: FormData) {
  await requireAdmin();
  try {
    const localPart = String(formData.get("localPart") ?? "")
      .trim()
      .toLowerCase();
    const displayName = String(formData.get("displayName") ?? "").trim();
    const quotaMb = Number(formData.get("quotaMb") ?? 5120);
    if (!/^[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9])?$/.test(localPart)) {
      throw new Error("Ünvan adı yanlışdır.");
    }
    if (!displayName || ![2048, 5120, 10240].includes(quotaMb)) {
      throw new Error("Ad və ya yaddaş limiti yanlışdır.");
    }
    assertMailcowSuccess(
      await createMailcowMailbox({
        localPart,
        displayName,
        password: password(formData.get("password")),
        quotaMb,
      }),
    );
  } catch {
    failed();
  }
  done("Yeni mail ünvanı yaradıldı.");
}

export async function setMailboxStatus(formData: FormData) {
  await requireAdmin();
  try {
    const username = mailbox(formData.get("username"));
    const active = String(formData.get("active")) === "1";
    if (username === PRIMARY_MAILBOX && !active) {
      throw new Error("Əsas mailbox deaktiv edilə bilməz.");
    }
    assertMailcowSuccess(await setMailcowMailboxActive(username, active));
  } catch {
    failed();
  }
  done("Mailbox statusu yeniləndi.");
}

export async function updateMailboxPassword(formData: FormData) {
  await requireAdmin();
  try {
    const username = mailbox(formData.get("username"));
    assertMailcowSuccess(
      await changeMailcowMailboxPassword(
        username,
        password(formData.get("password")),
      ),
    );
  } catch {
    failed();
  }
  done("Yeni şifrə yadda saxlanıldı.");
}

export async function removeMailbox(formData: FormData) {
  await requireAdmin();
  try {
    const username = mailbox(formData.get("username"));
    const confirmation = String(formData.get("confirmation") ?? "").trim();
    if (username === PRIMARY_MAILBOX || confirmation !== username) {
      throw new Error("Mailbox silinmə təsdiqi yanlışdır.");
    }
    assertMailcowSuccess(await deleteMailcowMailbox(username));
  } catch {
    failed();
  }
  done("Mailbox və onun məktubları silindi.");
}
