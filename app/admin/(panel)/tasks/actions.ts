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
  return { supabase, email };
}

export async function createTask(formData: FormData) {
  const { supabase, email } = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const assigneeId = String(formData.get("assigneeId") ?? "");
  const priority = String(formData.get("priority") ?? "medium");
  const deadline = String(formData.get("deadline") ?? "");

  if (!title || !assigneeId || !deadline) throw new Error("Tapşırıq, əməkdaş və son tarix mütləqdir.");
  if (!["low", "medium", "high"].includes(priority)) throw new Error("Prioritet yanlışdır.");

  const { error } = await supabase.from("admin_tasks").insert({
    title,
    description: description || null,
    assignee_id: assigneeId,
    priority,
    deadline: new Date(deadline).toISOString(),
    created_by: email,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tasks");
}

export async function addTeamMember(formData: FormData) {
  const { supabase } = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name) throw new Error("Əməkdaşın adını daxil edin.");

  const { error } = await supabase.from("team_members").insert({
    name,
    email: email || null,
  });
  if (error) throw new Error(error.code === "23505" ? "Bu əməkdaş artıq siyahıdadır." : error.message);
  revalidatePath("/admin/tasks");
}

export async function markTaskSeen(formData: FormData) {
  const { supabase, email } = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const now = new Date().toISOString();
  const { error } = await supabase.from("admin_tasks").update({ seen_at: now }).eq("id", id).is("seen_at", null);
  if (error) throw new Error(error.message);
  await supabase.from("task_updates").insert({
    task_id: id,
    author: email,
    note: "Tapşırığı gördü.",
  });
  revalidatePath("/admin/tasks");
}

export async function updateTask(formData: FormData) {
  const { supabase, email } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as TaskStatus;
  const note = String(formData.get("note") ?? "").trim();
  if (!id || !["todo", "in_progress", "done"].includes(status)) throw new Error("Status yanlışdır.");
  if (!note) throw new Error("Status dəyişikliyi üçün qısa qeyd yazın.");

  const { data: current, error: readError } = await supabase
    .from("admin_tasks")
    .select("status")
    .eq("id", id)
    .single();
  if (readError || !current) throw new Error("Tapşırıq tapılmadı.");

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("admin_tasks")
    .update({
      status,
      seen_at: now,
      completed_at: status === "done" ? now : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const { error: updateError } = await supabase.from("task_updates").insert({
    task_id: id,
    author: email,
    note,
    from_status: current.status,
    to_status: status,
  });
  if (updateError) throw new Error(updateError.message);
  revalidatePath("/admin/tasks");
}
