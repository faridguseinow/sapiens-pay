"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/access";

const currencies = new Set(["AZN", "USD", "EUR", "GBP", "TRY"]);
const expenseTypes = new Set(["advertising", "influencer", "content", "creative", "agency", "software", "other"]);

function text(formData: FormData, key: string, max = 300) {
  const value = String(formData.get(key) ?? "").trim();
  if (value.length > max) throw new Error(`${key} çox uzundur.`);
  return value;
}

function amount(formData: FormData, key: string, allowZero = true) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value < 0 || (!allowZero && value === 0)) throw new Error(`${key} yanlışdır.`);
  return value;
}

function optional(value: string) { return value || null; }

export async function createMarketingSource(formData: FormData) {
  const { supabase } = await requireRole("admin", "/admin/login");
  const name = text(formData, "name", 100);
  const key = text(formData, "key", 80).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const channel = text(formData, "channel", 80);
  if (!name || !key || !channel) throw new Error("Mənbə adı, açarı və kanalı vacibdir.");
  const { error } = await supabase.from("marketing_sources").insert({ name, key, channel, is_paid: formData.get("isPaid") === "on" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/analytics");
}

export async function createCampaign(formData: FormData) {
  const { supabase } = await requireRole("admin", "/admin/login");
  const name = text(formData, "name", 160);
  const platform = text(formData, "platform", 100);
  const sourceId = text(formData, "sourceId", 50);
  if (!name || !platform || !sourceId) throw new Error("Kampaniya adı, platforma və mənbə vacibdir.");
  const { error } = await supabase.from("marketing_campaigns").insert({
    name, platform, source_id: sourceId, objective: optional(text(formData, "objective", 200)),
    starts_at: optional(text(formData, "startsAt", 10)), ends_at: optional(text(formData, "endsAt", 10)), status: "active",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/analytics");
}

export async function upsertDailyMetric(formData: FormData) {
  const { supabase } = await requireRole("admin", "/admin/login");
  const metricDate = text(formData, "metricDate", 10);
  const sourceId = text(formData, "sourceId", 50);
  const campaignId = optional(text(formData, "campaignId", 50));
  const currency = text(formData, "currency", 3).toUpperCase();
  if (!metricDate || !sourceId || !currencies.has(currency)) throw new Error("Tarix, mənbə və valyuta yanlışdır.");
  const payload = {
    metric_date: metricDate, source_id: sourceId, campaign_id: campaignId, currency,
    spend: amount(formData, "spend"), spend_azn: amount(formData, "spendAzn"),
    impressions: Math.floor(amount(formData, "impressions")), reach: Math.floor(amount(formData, "reach")), clicks: Math.floor(amount(formData, "clicks")),
  };
  const { error } = await supabase.from("marketing_daily_metrics").upsert(payload, { onConflict: "metric_date,source_id,campaign_id" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/analytics");
}

export async function createMarketingExpense(formData: FormData) {
  const { supabase, member } = await requireRole("admin", "/admin/login");
  const currency = text(formData, "currency", 3).toUpperCase();
  const expenseType = text(formData, "expenseType", 30);
  if (!currencies.has(currency) || !expenseTypes.has(expenseType)) throw new Error("Valyuta və ya xərc növü yanlışdır.");
  const { error } = await supabase.from("marketing_expenses").insert({
    expense_date: text(formData, "expenseDate", 10), amount: amount(formData, "amount", false), amount_azn: amount(formData, "amountAzn", false), currency,
    platform: optional(text(formData, "platform", 100)), source_id: optional(text(formData, "sourceId", 50)), campaign_id: optional(text(formData, "campaignId", 50)),
    expense_type: expenseType, description: optional(text(formData, "description", 500)), created_by: member.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/analytics");
}

export async function createPayment(formData: FormData) {
  const { supabase } = await requireRole("admin", "/admin/login");
  const customerId = text(formData, "customerId", 50);
  const currency = text(formData, "currency", 3).toUpperCase();
  if (!customerId || !currencies.has(currency)) throw new Error("Müştəri və valyuta vacibdir.");
  const directCostRaw = text(formData, "directCostAzn", 30);
  const { data: customer } = await supabase.from("sales_customers").select("lead_id,source_id,campaign_id,product_id").eq("id", customerId).single();
  const { error } = await supabase.from("customer_payments").insert({
    customer_id: customerId, lead_id: customer?.lead_id ?? null, source_id: customer?.source_id ?? null, campaign_id: customer?.campaign_id ?? null,
    product_id: optional(text(formData, "productId", 50)) || customer?.product_id || null,
    amount: amount(formData, "amount", false), amount_azn: amount(formData, "amountAzn", false), direct_cost_azn: directCostRaw ? Number(directCostRaw) : null,
    currency, payment_status: "paid", revenue_type: text(formData, "revenueType", 20) === "recurring" ? "recurring" : "one_time",
    paid_at: new Date(text(formData, "paidAt", 30)).toISOString(), description: optional(text(formData, "description", 500)),
  });
  if (error) throw new Error(error.message);
  await supabase.from("sales_customers").update({ status: "won", won_at: new Date().toISOString() }).eq("id", customerId);
  if (customer?.lead_id) await supabase.from("leads").update({ status: "won", paid_at: new Date().toISOString() }).eq("id", customer.lead_id);
  revalidatePath("/admin/analytics");
}
