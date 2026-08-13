"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/access";
import { SAPIENS_SERVICES } from "@/lib/services";
import { SALES_STATUSES } from "@/lib/sales";

const statuses = SALES_STATUSES.map(({ value }) => value);

function readCustomer(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const serviceKey = String(formData.get("serviceKey") ?? "");
  const status = String(formData.get("status") ?? "new") as (typeof statuses)[number];
  const notes = String(formData.get("notes") ?? "").trim();
  const nextContactAt = String(formData.get("nextContactAt") ?? "");
  const potentialValue = Number(formData.get("potentialValue") ?? 0);
  const sourceId = String(formData.get("sourceId") ?? "").trim();

  if (!name || !phone) throw new Error("Müştərinin adı və telefonu mütləqdir.");
  if (name.length > 180 || phone.length > 50 || email.length > 254 || notes.length > 5000) throw new Error("Daxil edilən məlumatlardan biri çox uzundur.");
  if (!SAPIENS_SERVICES.some((service) => service.key === serviceKey)) throw new Error("Xidmət yanlışdır.");
  if (!statuses.includes(status)) throw new Error("Mərhələ yanlışdır.");
  if (!Number.isFinite(potentialValue) || potentialValue < 0) throw new Error("Məbləğ yanlışdır.");

  const nextContactDate = nextContactAt ? new Date(nextContactAt) : null;
  if (nextContactDate && Number.isNaN(nextContactDate.getTime())) throw new Error("Növbəti əlaqə tarixi yanlışdır.");

  return {
    name, phone, email: email || null, service_key: serviceKey, status,
    notes: notes || null,
    next_contact_at: nextContactDate?.toISOString() ?? null,
    potential_value: potentialValue,
    source_id: sourceId || null,
  };
}

export async function createSalesCustomer(formData: FormData) {
  const { supabase, member } = await requireRole("sales", "/sales/login");
  const payload = readCustomer(formData);
  if (!payload.source_id) throw new Error("Müştərinin mənbəyini seçin.");
  const { data: source } = await supabase.from("marketing_sources").select("id").eq("id", payload.source_id).eq("is_active", true).maybeSingle();
  if (!source) throw new Error("Mənbə yanlışdır və ya deaktivdir.");
  const { error } = await supabase.from("sales_customers").insert({
    ...payload,
    representative_id: member.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath("/sales/customers");
  revalidatePath("/admin/sales");
  redirect("/sales/customers");
}

export async function updateSalesCustomer(formData: FormData) {
  const { supabase, member } = await requireRole("sales", "/sales/login");
  const id = String(formData.get("id") ?? "");
  const payload = readCustomer(formData);
  if (payload.source_id) {
    const { data: source } = await supabase.from("marketing_sources").select("id").eq("id", payload.source_id).eq("is_active", true).maybeSingle();
    if (!source) throw new Error("Mənbə yanlışdır və ya deaktivdir.");
  }
  const { data: current } = await supabase.from("sales_customers").select("won_at").eq("id", id).eq("representative_id", member.id).maybeSingle();
  if (!current) throw new Error("Müştəri tapılmadı.");
  const { error } = await supabase
    .from("sales_customers")
    .update({ ...payload, won_at: payload.status === "won" ? current.won_at ?? new Date().toISOString() : null })
    .eq("id", id)
    .eq("representative_id", member.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/sales/customers/${id}`);
  revalidatePath("/sales");
  revalidatePath("/sales/customers");
  revalidatePath("/admin/sales");
}
