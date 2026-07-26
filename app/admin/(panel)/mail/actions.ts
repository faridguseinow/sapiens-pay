"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  assertMailcowSuccess,
  changeMailcowMailboxPassword,
  createMailcowMailbox,
  createMailcowAlias,
  deleteMailcowAlias,
  deleteMailcowMailbox,
  setMailcowMailboxActive,
} from "@/lib/mail/mailcow";
import { isMailAdminOwner } from "@/lib/mail/admin-access";

const DOMAIN = "sapiens-pay.com";
const PRIMARY_MAILBOX = "info@sapiens-pay.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/admin/login");
  const userId = typeof data.claims.sub === "string" ? data.claims.sub : "";
  const { data: member } = await supabase
    .from("team_members")
    .select("role")
    .eq("auth_user_id", userId)
    .maybeSingle();
  if (member?.role !== "admin") redirect("/sales");
  return data.claims;
}

async function requireMailOwner() {
  const claims = await requireAdmin();
  if (!isMailAdminOwner(claims.email)) {
    redirect(
      `/admin/mail?error=${encodeURIComponent("Bu əməliyyat yalnız mail idarəçisinə açıqdır.")}`,
    );
  }
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

function readableError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("password_complexity")) {
    return "Şifrə mail serverinin təhlükəsizlik tələblərinə uyğun deyil. Daha unikal şifrə yaradın.";
  }
  if (message.includes("is_alias_or_mailbox") || message.includes("object_exists")) {
    return "Bu mail ünvanı artıq mövcuddur.";
  }
  if (message.includes("mailbox_quota") || message.includes("domain_quota")) {
    return "Seçilən yaddaş limiti domenin mövcud limitini aşır.";
  }
  if (message.includes("access_denied")) {
    return "Mail serveri bu əməliyyata icazə vermədi.";
  }
  if (message && !message.includes("Mailcow") && !message.includes("HTTP")) {
    return message;
  }
  return "Əməliyyat tamamlanmadı. Mail serverinin cavabını yoxlayın.";
}

function failed(error: unknown, fields?: Record<string, string>) {
  const params = new URLSearchParams({ error: readableError(error), ...fields });
  redirect(`/admin/mail?${params.toString()}`);
}

export async function createMailbox(formData: FormData) {
  await requireAdmin();
  const localPart = String(formData.get("localPart") ?? "")
    .trim()
    .toLowerCase();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const quotaMb = Number(formData.get("quotaMb") ?? 5120);
  try {
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
  } catch (error) {
    failed(error, {
      displayName: displayName.slice(0, 80),
      localPart: localPart.slice(0, 64),
      quotaMb: String(quotaMb),
    });
  }
  done("Yeni mail ünvanı yaradıldı.");
}

export async function setMailboxStatus(formData: FormData) {
  await requireMailOwner();
  try {
    const username = mailbox(formData.get("username"));
    const active = String(formData.get("active")) === "1";
    if (username === PRIMARY_MAILBOX && !active) {
      throw new Error("Əsas mailbox deaktiv edilə bilməz.");
    }
    assertMailcowSuccess(await setMailcowMailboxActive(username, active));
  } catch (error) {
    failed(error);
  }
  done("Mailbox statusu yeniləndi.");
}

export async function updateMailboxPassword(formData: FormData) {
  await requireMailOwner();
  try {
    const username = mailbox(formData.get("username"));
    assertMailcowSuccess(
      await changeMailcowMailboxPassword(
        username,
        password(formData.get("password")),
      ),
    );
  } catch (error) {
    failed(error);
  }
  done("Yeni şifrə yadda saxlanıldı.");
}

export async function removeMailbox(formData: FormData) {
  await requireMailOwner();
  try {
    const username = mailbox(formData.get("username"));
    const confirmation = String(formData.get("confirmation") ?? "").trim();
    if (username === PRIMARY_MAILBOX || confirmation !== username) {
      throw new Error("Mailbox silinmə təsdiqi yanlışdır.");
    }
    assertMailcowSuccess(await deleteMailcowMailbox(username));
  } catch (error) {
    failed(error);
  }
  done("Mailbox və onun məktubları silindi.");
}

export async function createAlias(formData: FormData) {
  await requireAdmin();
  try {
    const localPart = String(formData.get("localPart") ?? "").trim().toLowerCase();
    const destination = mailbox(formData.get("destination"));
    if (!/^[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9])?$/.test(localPart)) throw new Error("Invalid alias");
    assertMailcowSuccess(await createMailcowAlias(`${localPart}@${DOMAIN}`, destination));
  } catch (error) { failed(error); }
  done("Alias yaradıldı.");
}

export async function removeAlias(formData: FormData) {
  await requireMailOwner();
  try {
    const id = Number(formData.get("id"));
    if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid alias");
    assertMailcowSuccess(await deleteMailcowAlias(id));
  } catch (error) { failed(error); }
  done("Alias silindi.");
}
