import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Lead } from "@/lib/database.types";
import { followUpTelegramText, isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey || !isTelegramConfigured) {
    return NextResponse.json({ error: "Notification service is not configured" }, { status: 503 });
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .lte("next_follow_up_at", new Date().toISOString())
    .order("next_follow_up_at", { ascending: true });

  if (error) return NextResponse.json({ error: "Could not load follow-ups" }, { status: 500 });

  const dueLeads = ((data ?? []) as Lead[]).filter(
    (lead) =>
      lead.next_follow_up_at &&
      !["won", "closed"].includes(lead.status) &&
      (!lead.profile?.followUpNotifiedAt ||
        new Date(lead.profile.followUpNotifiedAt) < new Date(lead.next_follow_up_at)),
  );

  let sent = 0;
  for (const lead of dueLeads) {
    const result = await sendTelegramMessage(
      followUpTelegramText({
        name: lead.name,
        phone: lead.phone,
        email: lead.profile?.email,
        service: lead.service_name || lead.profile?.service,
        packageName: lead.package_name || lead.profile?.package,
        followUpAt: lead.next_follow_up_at!,
      }),
    );
    if (!result.ok) continue;

    const notifiedAt = new Date().toISOString();
    await supabase
      .from("leads")
      .update({ profile: { ...lead.profile, followUpNotifiedAt: notifiedAt } })
      .eq("id", lead.id);
    sent += 1;
  }

  return NextResponse.json({ ok: true, checked: dueLeads.length, sent });
}
