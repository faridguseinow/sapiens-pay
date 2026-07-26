"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SalesAuthState = { error?: string } | undefined;

export async function salesLogin(
  _state: SalesAuthState,
  formData: FormData,
): Promise<SalesAuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "E-poçt və şifrəni daxil edin." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "E-poçt və ya şifrə yanlışdır." };

  const { data: member } = await supabase
    .from("team_members")
    .select("role")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (member?.role !== "sales") {
    await supabase.auth.signOut();
    return { error: "Bu giriş yalnız satış təmsilçiləri üçündür." };
  }
  redirect("/sales");
}

export async function salesLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sales/login");
}
