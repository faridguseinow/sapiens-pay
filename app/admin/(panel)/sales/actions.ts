"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/access";
import { SAPIENS_SERVICES } from "@/lib/services";
import type { SalesCustomerStatus } from "@/lib/database.types";

const statuses: SalesCustomerStatus[] = ["new", "contacted", "interested", "proposal", "won", "lost"];

export async function updateSalesCustomerAsAdmin(formData: FormData) {
  const { supabase } = await requireRole("admin", "/admin/login");
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const serviceKey = String(formData.get("serviceKey") ?? "");
  const status = String(formData.get("status") ?? "new") as SalesCustomerStatus;
  const representativeId = String(formData.get("representativeId") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const nextContactAt = String(formData.get("nextContactAt") ?? "").trim();
  const potentialValue = Number(formData.get("potentialValue") ?? 0);
  const sourceId = String(formData.get("sourceId") ?? "").trim();

  if (!id || !name || !phone) throw new Error("Müştərinin adı və telefonu mütləqdir.");
  if (name.length > 180 || phone.length > 50 || email.length > 254 || notes.length > 5000) {
    throw new Error("Daxil edilən məlumatlardan biri icazə verilən uzunluğu keçir.");
  }
  if (!SAPIENS_SERVICES.some((service) => service.key === serviceKey)) throw new Error("Xidmət yanlışdır.");
  if (!statuses.includes(status)) throw new Error("Mərhələ yanlışdır.");
  if (!Number.isFinite(potentialValue) || potentialValue < 0) throw new Error("Məbləğ yanlışdır.");

  const nextContactDate = nextContactAt ? new Date(nextContactAt) : null;
  if (nextContactDate && Number.isNaN(nextContactDate.getTime())) throw new Error("Növbəti əlaqə tarixi yanlışdır.");

  const { data: representative, error: representativeError } = await supabase
    .from("team_members")
    .select("id")
    .eq("id", representativeId)
    .eq("role", "sales")
    .eq("is_active", true)
    .maybeSingle();
  if (representativeError || !representative) throw new Error("Aktiv satış təmsilçisi seçilməyib.");
  if (sourceId) {
    const { data: source } = await supabase.from("marketing_sources").select("id").eq("id", sourceId).eq("is_active", true).maybeSingle();
    if (!source) throw new Error("Mənbə yanlışdır və ya deaktivdir.");
  }

  const { data: current } = await supabase.from("sales_customers").select("won_at").eq("id", id).maybeSingle();

  const { data, error } = await supabase
    .from("sales_customers")
    .update({
      name,
      phone,
      email: email || null,
      service_key: serviceKey,
      status,
      representative_id: representativeId,
      notes: notes || null,
      next_contact_at: nextContactDate?.toISOString() ?? null,
      potential_value: potentialValue,
      source_id: sourceId || null,
      won_at: status === "won" ? current?.won_at ?? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Müştəri tapılmadı.");

  revalidatePath("/admin/sales");
  revalidatePath(`/admin/sales/${id}`);
  revalidatePath("/admin/analytics");
  revalidatePath("/sales");
  revalidatePath("/sales/customers");
  revalidatePath(`/sales/customers/${id}`);
  redirect(`/admin/sales/${id}?saved=1`);
}
