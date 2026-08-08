import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AnalyticsProduct,
  CustomerPayment,
  Lead,
  MarketingCampaign,
  MarketingDailyMetric,
  MarketingExpense,
  MarketingSource,
  SalesCustomer,
  TeamMember,
} from "@/lib/database.types";

export type AttributionModel = "first_touch" | "last_touch";

export type AnalyticsFilters = {
  from: string;
  to: string;
  sourceId?: string;
  channel?: string;
  campaignId?: string;
  productId?: string;
  country?: string;
  salesId?: string;
  sdrId?: string;
  leadStatus?: string;
  clientStatus?: string;
  attribution: AttributionModel;
};

export type PerformanceRow = {
  id: string;
  label: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  qualified: number;
  deals: number;
  customers: number;
  revenue: number;
  ctr: number | null;
  cpc: number | null;
  cpl: number | null;
  cpql: number | null;
  cac: number | null;
  roas: number | null;
  roi: number | null;
};

export type AnalyticsSnapshot = {
  filters: AnalyticsFilters;
  options: {
    sources: MarketingSource[];
    campaigns: MarketingCampaign[];
    products: AnalyticsProduct[];
    team: TeamMember[];
    channels: string[];
    countries: string[];
  };
  totals: PerformanceRow & {
    otherExpenses: number;
    totalMarketingCost: number;
    grossProfit: number | null;
    blendedCac: number | null;
    recurringRevenue: number;
    mrr: number | null;
  };
  comparison: Record<string, number | null>;
  funnel: Array<{ key: string; label: string; count: number; previousRate: number | null; firstRate: number | null }>;
  sourceRows: PerformanceRow[];
  campaignRows: PerformanceRow[];
  productRows: PerformanceRow[];
  salesRows: Array<{ id: string; label: string; assigned: number; qualified: number; deals: number; customers: number; revenue: number; conversion: number | null }>;
  sdrRows: Array<{ id: string; label: string; assigned: number; contacted: number; qualified: number; passed: number; customers: number; revenue: number; qualificationRate: number | null }>;
  trend: Array<{ date: string; spend: number; leads: number; customers: number; revenue: number }>;
  tracking: {
    leadsWithoutSource: number;
    leadsWithoutCampaign: number;
    customersWithoutAttribution: number;
    dealsWithoutProduct: number;
    paymentsWithoutCustomer: number;
    leadsWithoutSdr: number;
    leadsWithoutSales: number;
    attributionCoverage: number | null;
  };
  expenses: MarketingExpense[];
  payments: CustomerPayment[];
  leads: Lead[];
};

const n = (value: unknown) => Number(value ?? 0) || 0;
const ratio = (numerator: number, denominator: number, scale = 1) =>
  denominator > 0 ? (numerator / denominator) * scale : null;
const day = (value: string) => value.slice(0, 10);

export function defaultAnalyticsDates(now = new Date()) {
  const to = now.toISOString().slice(0, 10);
  const fromDate = new Date(now);
  fromDate.setUTCDate(fromDate.getUTCDate() - 29);
  return { from: fromDate.toISOString().slice(0, 10), to };
}

export function parseAnalyticsFilters(query: Record<string, string | string[] | undefined>): AnalyticsFilters {
  const defaults = defaultAnalyticsDates();
  const one = (key: string) => {
    const value = query[key];
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  };
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const from = one("from");
  const to = one("to");
  return {
    from: from && datePattern.test(from) ? from : defaults.from,
    to: to && datePattern.test(to) ? to : defaults.to,
    sourceId: one("source"),
    channel: one("channel"),
    campaignId: one("campaign"),
    productId: one("product"),
    country: one("country"),
    salesId: one("sales"),
    sdrId: one("sdr"),
    leadStatus: one("leadStatus"),
    clientStatus: one("clientStatus"),
    attribution: one("attribution") === "first_touch" ? "first_touch" : "last_touch",
  };
}

function attributedSource(lead: Lead, model: AttributionModel) {
  return model === "first_touch"
    ? lead.first_touch_source_id || lead.source_id
    : lead.last_touch_source_id || lead.source_id;
}

function createRow(id: string, label: string): PerformanceRow {
  return { id, label, spend: 0, impressions: 0, clicks: 0, leads: 0, qualified: 0, deals: 0, customers: 0, revenue: 0, ctr: null, cpc: null, cpl: null, cpql: null, cac: null, roas: null, roi: null };
}

function finishRow(row: PerformanceRow): PerformanceRow {
  return {
    ...row,
    ctr: ratio(row.clicks, row.impressions, 100),
    cpc: ratio(row.spend, row.clicks),
    cpl: ratio(row.spend, row.leads),
    cpql: ratio(row.spend, row.qualified),
    cac: ratio(row.spend, row.customers),
    roas: ratio(row.revenue, row.spend),
    roi: row.spend > 0 ? ((row.revenue - row.spend) / row.spend) * 100 : null,
  };
}

function dateRange(filters: AnalyticsFilters) {
  return { start: `${filters.from}T00:00:00.000Z`, end: `${filters.to}T23:59:59.999Z` };
}

async function loadPeriod(supabase: SupabaseClient, filters: AnalyticsFilters) {
  const { start, end } = dateRange(filters);
  let leadsQuery = supabase.from("leads").select("*").gte("submitted_at", start).lte("submitted_at", end);
  let metricsQuery = supabase.from("marketing_daily_metrics").select("*").gte("metric_date", filters.from).lte("metric_date", filters.to);
  let expensesQuery = supabase.from("marketing_expenses").select("*").gte("expense_date", filters.from).lte("expense_date", filters.to);
  let paymentsQuery = supabase.from("customer_payments").select("*").eq("payment_status", "paid").gte("paid_at", start).lte("paid_at", end);
  let customersQuery = supabase.from("sales_customers").select("*").gte("created_at", start).lte("created_at", end);

  if (filters.campaignId) {
    metricsQuery = metricsQuery.eq("campaign_id", filters.campaignId);
    expensesQuery = expensesQuery.eq("campaign_id", filters.campaignId);
    paymentsQuery = paymentsQuery.eq("campaign_id", filters.campaignId);
    leadsQuery = leadsQuery.eq("campaign_id", filters.campaignId);
  }
  if (filters.productId) {
    leadsQuery = leadsQuery.eq("product_id", filters.productId);
    paymentsQuery = paymentsQuery.eq("product_id", filters.productId);
    customersQuery = customersQuery.eq("product_id", filters.productId);
  }
  if (filters.country) {
    leadsQuery = leadsQuery.eq("country", filters.country);
    customersQuery = customersQuery.eq("country", filters.country);
  }
  if (filters.salesId) leadsQuery = leadsQuery.eq("assigned_sales_id", filters.salesId);
  if (filters.sdrId) leadsQuery = leadsQuery.eq("assigned_sdr_id", filters.sdrId);
  if (filters.leadStatus) leadsQuery = leadsQuery.eq("status", filters.leadStatus);
  if (filters.clientStatus) customersQuery = customersQuery.eq("status", filters.clientStatus);

  const [leadsResult, metricsResult, expensesResult, paymentsResult, customersResult] = await Promise.all([
    leadsQuery, metricsQuery, expensesQuery, paymentsQuery, customersQuery,
  ]);
  const error = leadsResult.error || metricsResult.error || expensesResult.error || paymentsResult.error || customersResult.error;
  if (error) throw new Error(`Analitika məlumatları yüklənmədi: ${error.message}`);
  return {
    leads: (leadsResult.data ?? []) as Lead[],
    metrics: (metricsResult.data ?? []) as MarketingDailyMetric[],
    expenses: (expensesResult.data ?? []) as MarketingExpense[],
    payments: (paymentsResult.data ?? []) as CustomerPayment[],
    customers: (customersResult.data ?? []) as SalesCustomer[],
  };
}

function previousFilters(filters: AnalyticsFilters): AnalyticsFilters {
  const start = new Date(`${filters.from}T00:00:00Z`);
  const end = new Date(`${filters.to}T00:00:00Z`);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
  const previousEnd = new Date(start.getTime() - 86_400_000);
  const previousStart = new Date(previousEnd.getTime() - (days - 1) * 86_400_000);
  return { ...filters, from: previousStart.toISOString().slice(0, 10), to: previousEnd.toISOString().slice(0, 10) };
}

function compactTotals(data: Awaited<ReturnType<typeof loadPeriod>>) {
  const spend = data.metrics.reduce((sum, item) => sum + n(item.spend_azn), 0);
  const revenue = data.payments.reduce((sum, item) => sum + n(item.amount_azn), 0);
  const customerIds = new Set(data.payments.map((item) => item.customer_id));
  return { spend, revenue, leads: data.leads.length, customers: customerIds.size };
}

export async function getAnalyticsSnapshot(supabase: SupabaseClient, filters: AnalyticsFilters): Promise<AnalyticsSnapshot> {
  const [sourcesResult, campaignsResult, productsResult, teamResult, current, previous] = await Promise.all([
    supabase.from("marketing_sources").select("*").eq("is_active", true).order("name"),
    supabase.from("marketing_campaigns").select("*").order("created_at", { ascending: false }),
    supabase.from("analytics_products").select("*").eq("is_active", true).order("name"),
    supabase.from("team_members").select("*").eq("is_active", true).order("name"),
    loadPeriod(supabase, filters),
    loadPeriod(supabase, previousFilters(filters)),
  ]);
  const metadataError = sourcesResult.error || campaignsResult.error || productsResult.error || teamResult.error;
  if (metadataError) throw new Error(`Analitika seçimləri yüklənmədi: ${metadataError.message}`);

  const sources = (sourcesResult.data ?? []) as MarketingSource[];
  const campaigns = (campaignsResult.data ?? []) as MarketingCampaign[];
  const products = (productsResult.data ?? []) as AnalyticsProduct[];
  const team = (teamResult.data ?? []) as TeamMember[];
  const sourceById = new Map(sources.map((item) => [item.id, item]));
  const campaignById = new Map(campaigns.map((item) => [item.id, item]));
  const productById = new Map(products.map((item) => [item.id, item]));

  const channelSourceIds = filters.channel
    ? new Set(sources.filter((item) => item.channel === filters.channel).map((item) => item.id))
    : null;
  const matchesSource = (sourceId: string | null) =>
    (!filters.sourceId || sourceId === filters.sourceId) && (!channelSourceIds || (!!sourceId && channelSourceIds.has(sourceId)));

  current.leads = current.leads.filter((lead) => matchesSource(attributedSource(lead, filters.attribution)));
  current.metrics = current.metrics.filter((item) => matchesSource(item.source_id));
  current.expenses = current.expenses.filter((item) => matchesSource(item.source_id));
  current.payments = current.payments.filter((item) => matchesSource(item.source_id));

  const sourceRows = new Map<string, PerformanceRow>();
  const campaignRows = new Map<string, PerformanceRow>();
  const productRows = new Map<string, PerformanceRow>();
  const getRow = (map: Map<string, PerformanceRow>, id: string, label: string) => {
    if (!map.has(id)) map.set(id, createRow(id, label));
    return map.get(id)!;
  };

  for (const metric of current.metrics) {
    const source = sourceById.get(metric.source_id);
    const sourceRow = getRow(sourceRows, metric.source_id, source?.name ?? "Mənbə göstərilməyib");
    sourceRow.spend += n(metric.spend_azn); sourceRow.impressions += n(metric.impressions); sourceRow.clicks += n(metric.clicks);
    if (metric.campaign_id) {
      const campaignRow = getRow(campaignRows, metric.campaign_id, campaignById.get(metric.campaign_id)?.name ?? "Kampaniya");
      campaignRow.spend += n(metric.spend_azn); campaignRow.impressions += n(metric.impressions); campaignRow.clicks += n(metric.clicks);
    }
  }
  for (const lead of current.leads) {
    const sourceId = attributedSource(lead, filters.attribution) || "unattributed";
    const sourceRow = getRow(sourceRows, sourceId, sourceById.get(sourceId)?.name ?? "Mənbəsiz");
    sourceRow.leads += 1;
    if (lead.status === "qualified" || lead.status === "won") sourceRow.qualified += 1;
    if (lead.status === "won") sourceRow.deals += 1;
    if (lead.campaign_id) {
      const row = getRow(campaignRows, lead.campaign_id, campaignById.get(lead.campaign_id)?.name ?? "Kampaniya");
      row.leads += 1; if (lead.status === "qualified" || lead.status === "won") row.qualified += 1; if (lead.status === "won") row.deals += 1;
    }
    const productId = lead.product_id || lead.service_key || "unassigned";
    const row = getRow(productRows, productId, productById.get(productId)?.name ?? lead.service_name ?? lead.service_key ?? "Məhsulsuz");
    row.leads += 1; if (lead.status === "qualified" || lead.status === "won") row.qualified += 1; if (lead.status === "won") row.deals += 1;
  }
  const paidCustomerIds = new Set<string>();
  for (const payment of current.payments) {
    paidCustomerIds.add(payment.customer_id);
    const sourceId = payment.source_id || "unattributed";
    const sourceRow = getRow(sourceRows, sourceId, sourceById.get(sourceId)?.name ?? "Mənbəsiz");
    sourceRow.revenue += n(payment.amount_azn);
    if (payment.campaign_id) getRow(campaignRows, payment.campaign_id, campaignById.get(payment.campaign_id)?.name ?? "Kampaniya").revenue += n(payment.amount_azn);
    const productId = payment.product_id || "unassigned";
    getRow(productRows, productId, productById.get(productId)?.name ?? "Məhsulsuz").revenue += n(payment.amount_azn);
  }
  for (const customerId of paidCustomerIds) {
    const customer = current.customers.find((item) => item.id === customerId);
    const sourceId = customer?.source_id || current.payments.find((item) => item.customer_id === customerId)?.source_id || "unattributed";
    getRow(sourceRows, sourceId, sourceById.get(sourceId)?.name ?? "Mənbəsiz").customers += 1;
    const campaignId = customer?.campaign_id || current.payments.find((item) => item.customer_id === customerId)?.campaign_id;
    if (campaignId) getRow(campaignRows, campaignId, campaignById.get(campaignId)?.name ?? "Kampaniya").customers += 1;
    const productId = customer?.product_id || current.payments.find((item) => item.customer_id === customerId)?.product_id || "unassigned";
    getRow(productRows, productId, productById.get(productId)?.name ?? "Məhsulsuz").customers += 1;
  }

  const adSpend = current.metrics.reduce((sum, item) => sum + n(item.spend_azn), 0);
  const otherExpenses = current.expenses.filter((item) => item.expense_type !== "advertising").reduce((sum, item) => sum + n(item.amount_azn), 0);
  const totalMarketingCost = adSpend + otherExpenses;
  const revenue = current.payments.reduce((sum, item) => sum + n(item.amount_azn), 0);
  const directCosts = current.payments.reduce((sum, item) => sum + n(item.direct_cost_azn), 0);
  const hasDirectCosts = current.payments.length > 0 && current.payments.every((item) => item.direct_cost_azn !== null);
  const totals = finishRow({
    ...createRow("total", "Ümumi"),
    spend: adSpend,
    impressions: current.metrics.reduce((sum, item) => sum + n(item.impressions), 0),
    clicks: current.metrics.reduce((sum, item) => sum + n(item.clicks), 0),
    leads: current.leads.length,
    qualified: current.leads.filter((item) => item.status === "qualified" || item.status === "won").length,
    deals: current.leads.filter((item) => item.status === "won").length,
    customers: paidCustomerIds.size,
    revenue,
  });
  const recurringRevenue = current.payments.filter((item) => item.revenue_type === "recurring").reduce((sum, item) => sum + n(item.amount_azn), 0);

  const funnelCounts = [
    ["impressions", "Göstərişlər", totals.impressions], ["clicks", "Kliklər", totals.clicks], ["leads", "Müraciətlər", totals.leads],
    ["qualified", "Uyğun müraciətlər", totals.qualified], ["contacted", "Danışıqlar", current.leads.filter((item) => !!item.contacted_at || item.status !== "new").length],
    ["proposals", "Təkliflər", current.customers.filter((item) => ["proposal", "won"].includes(item.status)).length], ["deals", "Bağlanan satışlar", totals.deals], ["customers", "Ödənişli müştərilər", totals.customers],
  ] as const;
  const firstPositive = funnelCounts.find((item) => item[2] > 0)?.[2] ?? 0;

  const salesRows = team.map((member) => {
    const assigned = current.leads.filter((item) => item.assigned_sales_id === member.id);
    const memberCustomers = current.customers.filter((item) => item.representative_id === member.id);
    const memberCustomerIds = new Set(memberCustomers.map((item) => item.id));
    const memberPayments = current.payments.filter((item) => memberCustomerIds.has(item.customer_id));
    const customers = new Set(memberPayments.map((item) => item.customer_id)).size;
    return { id: member.id, label: member.name, assigned: assigned.length, qualified: assigned.filter((item) => ["qualified", "won"].includes(item.status)).length, deals: memberCustomers.filter((item) => item.status === "won").length, customers, revenue: memberPayments.reduce((sum, item) => sum + n(item.amount_azn), 0), conversion: ratio(customers, assigned.length, 100) };
  }).filter((item) => item.assigned || item.deals || item.revenue);
  const sdrRows = team.map((member) => {
    const assigned = current.leads.filter((item) => item.assigned_sdr_id === member.id);
    const passed = assigned.filter((item) => !!item.assigned_sales_id);
    const leadIds = new Set(assigned.map((item) => item.id));
    const payments = current.payments.filter((item) => !!item.lead_id && leadIds.has(item.lead_id));
    return { id: member.id, label: member.name, assigned: assigned.length, contacted: assigned.filter((item) => !!item.contacted_at || item.status !== "new").length, qualified: assigned.filter((item) => ["qualified", "won"].includes(item.status)).length, passed: passed.length, customers: new Set(payments.map((item) => item.customer_id)).size, revenue: payments.reduce((sum, item) => sum + n(item.amount_azn), 0), qualificationRate: ratio(assigned.filter((item) => ["qualified", "won"].includes(item.status)).length, assigned.length, 100) };
  }).filter((item) => item.assigned || item.revenue);

  const trendMap = new Map<string, { date: string; spend: number; leads: number; customers: number; revenue: number }>();
  const trendRow = (date: string) => { const key = day(date); if (!trendMap.has(key)) trendMap.set(key, { date: key, spend: 0, leads: 0, customers: 0, revenue: 0 }); return trendMap.get(key)!; };
  current.metrics.forEach((item) => { trendRow(item.metric_date).spend += n(item.spend_azn); });
  current.leads.forEach((item) => { trendRow(item.submitted_at).leads += 1; });
  current.payments.forEach((item) => { const row = trendRow(item.paid_at || item.created_at); row.revenue += n(item.amount_azn); row.customers += 1; });

  const currentCompact = compactTotals(current);
  const previousCompact = compactTotals(previous);
  const change = (key: keyof typeof currentCompact) => previousCompact[key] > 0 ? ((currentCompact[key] - previousCompact[key]) / previousCompact[key]) * 100 : null;
  const attributedLeadCount = current.leads.filter((item) => !!attributedSource(item, filters.attribution)).length;

  return {
    filters,
    options: { sources, campaigns, products, team, channels: [...new Set(sources.map((item) => item.channel))].sort(), countries: [...new Set([...current.leads.map((item) => item.country), ...current.customers.map((item) => item.country)].filter((item): item is string => !!item))].sort() },
    totals: { ...totals, otherExpenses, totalMarketingCost, grossProfit: hasDirectCosts ? revenue - directCosts : null, blendedCac: ratio(totalMarketingCost, paidCustomerIds.size), recurringRevenue, mrr: recurringRevenue > 0 ? recurringRevenue : null },
    comparison: { spend: change("spend"), leads: change("leads"), customers: change("customers"), revenue: change("revenue") },
    funnel: funnelCounts.map((item, index) => ({ key: item[0], label: item[1], count: item[2], previousRate: index ? ratio(item[2], funnelCounts[index - 1][2], 100) : null, firstRate: ratio(item[2], firstPositive, 100) })),
    sourceRows: [...sourceRows.values()].map(finishRow).sort((a, b) => b.revenue - a.revenue || b.leads - a.leads),
    campaignRows: [...campaignRows.values()].map(finishRow).sort((a, b) => b.revenue - a.revenue || b.spend - a.spend),
    productRows: [...productRows.values()].map(finishRow).sort((a, b) => b.revenue - a.revenue || b.leads - a.leads),
    salesRows, sdrRows,
    trend: [...trendMap.values()].sort((a, b) => a.date.localeCompare(b.date)),
    tracking: { leadsWithoutSource: current.leads.length - attributedLeadCount, leadsWithoutCampaign: current.leads.filter((item) => !item.campaign_id).length, customersWithoutAttribution: current.customers.filter((item) => !item.source_id).length, dealsWithoutProduct: current.leads.filter((item) => item.status === "won" && !item.product_id).length, paymentsWithoutCustomer: 0, leadsWithoutSdr: current.leads.filter((item) => !item.assigned_sdr_id).length, leadsWithoutSales: current.leads.filter((item) => !item.assigned_sales_id).length, attributionCoverage: ratio(attributedLeadCount, current.leads.length, 100) },
    expenses: current.expenses.sort((a, b) => b.expense_date.localeCompare(a.expense_date)), payments: current.payments.sort((a, b) => (b.paid_at || b.created_at).localeCompare(a.paid_at || a.created_at)), leads: current.leads,
  };
}
