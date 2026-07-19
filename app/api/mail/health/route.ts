import { createClient } from "@/lib/supabase/server";
import { getResend } from "@/lib/resend";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const raw = process.env.RESEND_API_KEY ?? "";
  const normalized = raw
    .trim()
    .replace(/^RESEND_API_KEY\s*=\s*/i, "")
    .replace(/^(["'])(.*)\1$/, "$2")
    .trim();
  const result = await getResend().domains.list();
  return Response.json({
    configured: Boolean(normalized),
    prefixOk: normalized.startsWith("re_"),
    length: normalized.length,
    apiOk: !result.error,
    apiError: result.error?.message ?? null,
  });
}
