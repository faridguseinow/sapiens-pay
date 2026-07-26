"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/access";
import { SAPIENS_SERVICES } from "@/lib/services";
import type { SalesCustomerStatus } from "@/lib/database.types";

const statuses: SalesCustomerStatus[] = ["new", "contacted", "interested", "proposal", "won", "lost"];

function readCustomer(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const serviceKey = String(formData.get("serviceKey") ?? "");
  const status = String(formData.get("status") ?? "new") as SalesCustomerStatus;
  const notes = String(formData.get("notes") ?? "").trim();
  const nextContactAt = String(formData.get("nextContactAt") ?? "");
  const potentialValue = Number(formData.get("potentialValue") ?? 0);

  if (!name || !phone) throw new Error("Müştərinin adı və telefonu mütləqdir.");
  if (!SAPIENS_SERVICES.some((service) => service.key === serviceKey)) throw new Error("Xidmət yanlışdır.");
  if (!statuses.includes(status)) throw new Error("Mərhələ yanlışdır.");
  if (!Number.isFinite(potentialValue) || potentialValue < 0) throw new Error("Məbləğ yanlışdır.");

  return {
    name, phone, email: email || null, service_key: serviceKey, status,
    notes: notes || null,
    next_contact_at: nextContactAt ? new Date(nextContactAt).toISOString() : null,
    potential_value: potentialValue,
  };
}

export async function createSalesCustomer(formData: FormData) {
  const { supabase, member } = await requireRole("sales", "/sales/login");
  const payload = readCustomer(formData);
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
  const { error } = await supabase
    .from("sales_customers")
    .update(payload)
    .eq("id", id)
    .eq("representative_id", member.id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath("/sales/customers");
  revalidatePath("/admin/sales");
}
