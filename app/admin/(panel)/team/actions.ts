"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/auth/access";
import { isMailAdminOwner } from "@/lib/mail/admin-access";
import type { UserRole } from "@/lib/database.types";

export async function updateStaffRole(formData: FormData) {
  const { supabase, claims, member } = await getCurrentStaff();
  if (!claims || member?.role !== "admin") redirect("/admin/login");
  if (!isMailAdminOwner(claims.email)) throw new Error("Rollar yalnız sistem sahibi tərəfindən dəyişdirilə bilər.");

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;
  if (!id || !["admin", "sales"].includes(role)) throw new Error("Rol yanlışdır.");
  if (id === member.id && role !== "admin") throw new Error("Öz admin rolunuzu dəyişə bilməzsiniz.");

  const { error } = await supabase.from("team_members").update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
  revalidatePath("/admin/tasks");
  revalidatePath("/admin/sales");
}
