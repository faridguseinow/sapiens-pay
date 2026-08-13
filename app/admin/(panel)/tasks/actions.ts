"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TaskStatus } from "@/lib/database.types";

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/admin/login");
  const email = typeof data.claims.email === "string" ? data.claims.email : "Əməkdaş";
  const userId = typeof data.claims.sub === "string" ? data.claims.sub : "";
  const { data: member } = await supabase
    .from("team_members")
    .select("role")
    .eq("auth_user_id", userId)
    .maybeSingle();
  return { supabase, email, userId, role: member?.role };
}

export async function createTask(formData: FormData) {
  const { supabase, email, role } = await requireUser();
  if (role !== "admin") throw new Error("Tapşırığı yalnız admin yarada bilər.");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const assigneeId = String(formData.get("assigneeId") ?? "");
  const priority = String(formData.get("priority") ?? "medium");
  const deadline = String(formData.get("deadline") ?? "");

  if (!title || !assigneeId || !deadline) throw new Error("Tapşırıq, əməkdaş və son tarix mütləqdir.");
  if (title.length > 180) throw new Error("Tapşırıq başlığı maksimum 180 simvol ola bilər.");
  if (description.length > 4000) throw new Error("Açıqlama maksimum 4000 simvol ola bilər.");
  if (!["low", "medium", "high"].includes(priority)) throw new Error("Prioritet yanlışdır.");
  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) throw new Error("Son tarix yanlışdır.");
  if (deadlineDate.getTime() <= Date.now()) throw new Error("Son tarix gələcək vaxt olmalıdır.");

  const { data: assignee, error: assigneeError } = await supabase
    .from("team_members")
    .select("id")
    .eq("id", assigneeId)
    .eq("is_active", true)
    .not("auth_user_id", "is", null)
    .maybeSingle();
  if (assigneeError || !assignee) throw new Error("Aktiv əməkdaş seçilməyib.");

  const { error } = await supabase.from("admin_tasks").insert({
    title,
    description: description || null,
    assignee_id: assigneeId,
    priority,
    deadline: deadlineDate.toISOString(),
    created_by: email,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tasks");
  revalidatePath("/sales");
  revalidatePath("/sales/tasks");
}

export async function deleteTask(formData: FormData) {
  const { supabase, role } = await requireUser();
  if (role !== "admin") throw new Error("Tapşırığı yalnız admin silə bilər.");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Tapşırıq seçilməyib.");

  const { error } = await supabase.rpc("archive_internal_task", { task_id: id });
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/tasks");
  revalidatePath("/sales");
  revalidatePath("/sales/tasks");
}

export async function markTaskSeen(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const { error } = await supabase.rpc("mark_internal_task_seen", { task_id: id });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tasks");
  revalidatePath("/sales");
  revalidatePath("/sales/tasks");
}

export async function updateTask(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as TaskStatus;
  const note = String(formData.get("note") ?? "").trim();
  if (!id || !["todo", "in_progress", "done"].includes(status)) throw new Error("Status yanlışdır.");
  if (!note) throw new Error("Status dəyişikliyi üçün qısa qeyd yazın.");
  if (note.length > 2000) throw new Error("Qeyd maksimum 2000 simvol ola bilər.");
  const { error } = await supabase.rpc("update_internal_task_status", {
    task_id: id,
    next_status: status,
    update_note: note,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tasks");
  revalidatePath("/sales");
  revalidatePath("/sales/tasks");
}
