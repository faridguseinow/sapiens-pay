"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SetPasswordState = { error?: string } | undefined;

export async function setSalesPassword(
  _state: SetPasswordState,
  formData: FormData,
): Promise<SetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (password.length < 10) return { error: "Şifrə ən azı 10 simvol olmalıdır." };
  if (password !== confirmation) return { error: "Şifrələr eyni deyil." };

  const supabase = await createClient();
  const { data: userResult } = await supabase.auth.getUser();
  if (!userResult.user) redirect("/sales/login?invite=invalid");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Şifrə yadda saxlanmadı. Dəvət linkini yenidən açın." };

  redirect("/sales");
}
