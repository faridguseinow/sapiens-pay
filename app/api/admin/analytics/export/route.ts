import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/lib/auth/access";
import { getAnalyticsSnapshot, parseAnalyticsFilters } from "@/lib/analytics";

export const runtime = "nodejs";

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(headers: string[], rows: unknown[][]) {
  return `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
}

export async function GET(request: Request) {
  const { supabase, member } = await getCurrentStaff();
  if (!member || member.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  const dataset = url.searchParams.get("dataset") || "sources";
  const snapshot = await getAnalyticsSnapshot(supabase, parseAnalyticsFilters(query));

  let headers: string[];
  let rows: unknown[][];
  if (dataset === "leads" || dataset === "reports") {
    headers = ["ID", "Ad", "Telefon", "Xidmət", "Status", "Mənbə ID", "Kampaniya ID", "Məhsul ID", "Tarix"];
    rows = snapshot.leads.map((item) => [item.id, item.name, item.phone, item.service_name || item.service_key, item.status, item.source_id, item.campaign_id, item.product_id, item.submitted_at]);
  } else if (dataset === "expenses") {
    headers = ["Tarix", "Növ", "Platforma", "Məbləğ", "Valyuta", "AZN", "Mənbə ID", "Kampaniya ID", "Açıqlama"];
    rows = snapshot.expenses.map((item) => [item.expense_date, item.expense_type, item.platform, item.amount, item.currency, item.amount_azn, item.source_id, item.campaign_id, item.description]);
  } else if (dataset === "revenue") {
    headers = ["Ödəniş ID", "Müştəri ID", "Tarix", "Məbləğ", "Valyuta", "AZN", "Birbaşa xərc AZN", "Gəlir növü"];
    rows = snapshot.payments.map((item) => [item.id, item.customer_id, item.paid_at, item.amount, item.currency, item.amount_azn, item.direct_cost_azn, item.revenue_type]);
  } else {
    const performance = dataset === "campaigns" ? snapshot.campaignRows : dataset === "overview" || dataset === "acquisition" || dataset === "sources" ? snapshot.sourceRows : snapshot.productRows;
    headers = ["Ad", "Xərc AZN", "Göstəriş", "Klik", "CTR", "Lead", "CPL", "Uyğun", "Müştəri", "CAC", "Gəlir AZN", "ROAS", "ROI"];
    rows = performance.map((item) => [item.label, item.spend, item.impressions, item.clicks, item.ctr, item.leads, item.cpl, item.qualified, item.customers, item.cac, item.revenue, item.roas, item.roi]);
  }

  return new Response(toCsv(headers, rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="sapiens-analytics-${dataset}-${snapshot.filters.from}-${snapshot.filters.to}.csv"`,
      "cache-control": "private, no-store",
    },
  });
}
