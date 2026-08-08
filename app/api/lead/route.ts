import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import { newLeadTelegramText, sendTelegramMessage } from "@/lib/telegram";

export const runtime = "nodejs";

type LeadPayload = {
  locale: string;
  serviceKey: string;
  serviceName: string;
  packageName: string;
  sourcePath: string;
  sourceLabel: string;
  estimatedLoss: number;
  contact: {
    name: string;
    email: string;
    phone: string;
    preferredContact: string;
  };
  profile: {
    businessType: string;
    adBudget: string;
    commissionAmount: string;
    growthPlan: string;
  };
  qa: Array<{ question: string; answer: string }>;
  submittedAt: string;
  tracking?: {
    first?: { source?: string; medium?: string; campaign?: string };
    last?: { source?: string; medium?: string; campaign?: string; content?: string; term?: string };
    landingPage?: string;
    referrer?: string;
  } | null;
};

function sourceKey(value: string | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();
  if (["facebook", "fb", "meta", "instagram", "ig"].includes(normalized)) return "meta-ads";
  if (["google", "googleads", "google-ads"].includes(normalized)) return "google-ads";
  if (["telegram", "referral", "partner", "whatsapp", "direct", "website"].includes(normalized)) return normalized;
  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function validatePayload(data: unknown): data is LeadPayload {
  if (!data || typeof data !== "object") return false;

  const payload = data as Partial<LeadPayload>;
  if (!payload.contact?.name || !payload.contact.phone) return false;
  if (
    payload.contact.name.trim().length < 2 ||
    payload.contact.name.length > 100 ||
    typeof payload.contact.email !== "string" ||
    payload.contact.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.contact.email) ||
    !/^\+?[\d\s()-]{7,24}$/.test(payload.contact.phone)
  ) {
    return false;
  }
  if (!["call", "whatsapp", "telegram"].includes(payload.contact.preferredContact)) {
    return false;
  }
  if (!payload.profile) return false;
  if (
    !["foreign-bank-accounts", "shopify-payments", "company-formation", "international-payments"].includes(
      payload.serviceKey ?? "",
    ) ||
    !payload.serviceName ||
    payload.serviceName.length > 160 ||
    !payload.packageName ||
    payload.packageName.length > 160 ||
    !payload.sourcePath ||
    payload.sourcePath.length > 300 ||
    (payload.sourceLabel?.length ?? 0) > 160
  ) {
    return false;
  }
  if (
    !Array.isArray(payload.qa) ||
    payload.qa.length < 6 ||
    payload.qa.length > 12 ||
    payload.qa.some(
      (item) =>
        !item ||
        typeof item.question !== "string" ||
        typeof item.answer !== "string" ||
        item.question.length > 300 ||
        item.answer.length > 500,
    )
  ) {
    return false;
  }
  if (!["az", "ru", "en"].includes(payload.locale ?? "")) return false;
  if (!Number.isFinite(payload.estimatedLoss) || Math.abs(payload.estimatedLoss!) > 1_000_000_000) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 50_000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body: unknown = await request.json();

    if (!validatePayload(body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!isSupabaseConfigured) {
      console.error("[api/lead] Supabase is not configured.");
      return NextResponse.json({ error: "Lead service unavailable" }, { status: 503 });
    }

    const supabase = createPublicClient();
    const firstSourceKey = sourceKey(body.tracking?.first?.source);
    const lastSourceKey = sourceKey(body.tracking?.last?.source) || firstSourceKey;
    const sourceKeys = [...new Set([firstSourceKey, lastSourceKey].filter(Boolean))];
    const { data: matchedSources } = sourceKeys.length
      ? await supabase.from("marketing_sources").select("id,key").in("key", sourceKeys)
      : { data: [] };
    const sourceIds = new Map((matchedSources ?? []).map((item) => [item.key, item.id]));
    const firstSourceId = sourceIds.get(firstSourceKey) ?? null;
    const lastSourceId = sourceIds.get(lastSourceKey) ?? null;
    const { error } = await supabase.from("leads").insert({
      status: "new",
      name: body.contact.name,
      phone: body.contact.phone,
      preferred_contact: body.contact.preferredContact,
      estimated_loss: body.estimatedLoss,
      locale: body.locale,
      submitted_at: new Date().toISOString(),
      service_key: body.serviceKey,
      service_name: body.serviceName,
      package_name: body.packageName,
      source_path: body.sourcePath,
      source_label: body.sourceLabel,
      source_id: lastSourceId || firstSourceId,
      first_touch_source_id: firstSourceId,
      first_touch_medium: body.tracking?.first?.medium?.slice(0, 160) || null,
      first_touch_campaign: body.tracking?.first?.campaign?.slice(0, 200) || null,
      last_touch_source_id: lastSourceId,
      last_touch_medium: body.tracking?.last?.medium?.slice(0, 160) || null,
      last_touch_campaign: body.tracking?.last?.campaign?.slice(0, 200) || null,
      lead_medium: body.tracking?.last?.medium?.slice(0, 160) || null,
      lead_content: body.tracking?.last?.content?.slice(0, 200) || null,
      lead_term: body.tracking?.last?.term?.slice(0, 200) || null,
      landing_page: body.tracking?.landingPage?.slice(0, 1000) || body.sourcePath,
      referrer: body.tracking?.referrer?.slice(0, 1000) || null,
      profile: body.profile,
      answers: body.qa,
    });

    if (error) {
      console.error("[api/lead] Failed to save lead to Supabase:", error);
      return NextResponse.json({ error: "Lead could not be saved" }, { status: 503 });
    }

    await sendTelegramMessage(
      newLeadTelegramText({
        name: body.contact.name,
        phone: body.contact.phone,
        email: body.contact.email,
        service: body.serviceName,
        packageName: body.packageName,
        message:
          typeof body.profile === "object" && body.profile && "details" in body.profile
            ? String(body.profile.details ?? "")
            : "",
      }),
    );

    return NextResponse.json({ ok: true, savedToAdmin: true });
  } catch (error) {
    console.error("[api/lead] Failed to process lead:", error);
    return NextResponse.json({ error: "Lead could not be saved" }, { status: 500 });
  }
}
