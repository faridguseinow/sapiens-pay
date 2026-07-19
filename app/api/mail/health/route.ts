import { createClient } from "@/lib/supabase/server";
import { getResend } from "@/lib/resend";
import { createHash } from "node:crypto";

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
  const inbound = await getResend().emails.receiving.list({ limit: 1 });
  const fingerprint = createHash("sha256").update(normalized).digest("hex");
  const expected = process.env.RESEND_API_KEY_FINGERPRINT ?? "";
  return Response.json({
    configured: Boolean(normalized),
    prefixOk: normalized.startsWith("re_"),
    length: normalized.length,
    fingerprintMatches: Boolean(expected) && fingerprint === expected,
    apiOk: !result.error,
    receivingApiOk: !inbound.error,
    receivingError: inbound.error?.message ?? null,
  });
}
