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
};

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
    const { error } = await supabase.from("leads").insert({
      status: "new",
      name: body.contact.name,
      phone: body.contact.phone,
      preferred_contact: body.contact.preferredContact,
      estimated_loss: body.estimatedLoss,
      locale: body.locale,
      submitted_at: new Date().toISOString(),
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
