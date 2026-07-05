import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/database.types";
import {
  filterLeads,
  leadPackage,
  leadService,
  type LeadFilters,
} from "@/lib/admin-leads";

export const runtime = "nodejs";

const statusLabels: Record<string, string> = {
  new: "Yeni",
  contacted: "Əlaqə saxlanılıb",
  qualified: "Maraqlanır",
  won: "Müştəri oldu",
  closed: "Uyğun deyil",
};

function csvCell(value: unknown) {
  let text = String(value ?? "").replace(/\r?\n/g, " ").trim();
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function formatDate(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("az-AZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Baku",
  }).format(new Date(value));
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  if (!authData?.claims) return new Response("Unauthorized", { status: 401 });

  const url = new URL(request.url);
  const filters: LeadFilters = {
    q: url.searchParams.get("q") || undefined,
    status: url.searchParams.get("status") || undefined,
    service: url.searchParams.get("service") || undefined,
    package: url.searchParams.get("package") || undefined,
    from: url.searchParams.get("from") || undefined,
    to: url.searchParams.get("to") || undefined,
    attention: url.searchParams.get("attention") || undefined,
  };
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) return new Response("Export failed", { status: 500 });

  const leads = filterLeads((data ?? []) as Lead[], filters);
  const rows = [
    [
      "Ad",
      "Telefon",
      "E-poçt",
      "Əlaqə üsulu",
      "Xidmət",
      "Paket",
      "Müştəri mesajı",
      "Mərhələ",
      "Prioritet",
      "Daxil olma tarixi",
      "Növbəti əlaqə",
      "Daxili qeyd",
    ],
    ...leads.map((lead) => [
      lead.name,
      lead.phone,
      lead.profile?.email,
      lead.preferred_contact,
      leadService(lead),
      leadPackage(lead),
      lead.profile?.details,
      statusLabels[lead.status] ?? lead.status,
      lead.profile?.priority ?? "medium",
      formatDate(lead.submitted_at),
      formatDate(lead.next_follow_up_at),
      lead.notes,
    ]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
  const filename = `sapiens-muracietler-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
