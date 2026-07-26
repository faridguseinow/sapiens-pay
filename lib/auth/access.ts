import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TeamMember, UserRole } from "@/lib/database.types";

export async function getCurrentStaff() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return { supabase, claims: null, member: null };

  const userId = typeof data.claims.sub === "string" ? data.claims.sub : "";
  const { data: member } = userId
    ? await supabase.from("team_members").select("*").eq("auth_user_id", userId).maybeSingle()
    : { data: null };

  return {
    supabase,
    claims: data.claims,
    member: (member as TeamMember | null) ?? null,
  };
}

export async function requireRole(role: UserRole, loginPath: string) {
  const context = await getCurrentStaff();
  if (!context.claims) redirect(loginPath);
  if (context.member?.role !== role) {
    redirect(context.member?.role === "sales" ? "/sales" : "/admin");
  }
  return { ...context, member: context.member as TeamMember };
}
