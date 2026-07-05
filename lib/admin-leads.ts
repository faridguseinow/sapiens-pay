import type { Lead } from "./database.types";

export type LeadFilters = {
  q?: string;
  status?: string;
  service?: string;
  package?: string;
  from?: string;
  to?: string;
  attention?: string;
};

export function leadService(lead: Lead) {
  return lead.service_name || lead.profile?.service || "Ümumi müraciət";
}

export function leadPackage(lead: Lead) {
  return lead.package_name || lead.profile?.package || "";
}

export function filterLeads(leads: Lead[], filters: LeadFilters, now = new Date()) {
  const search = filters.q?.trim().toLocaleLowerCase("az") ?? "";
  const from = filters.from ? new Date(`${filters.from}T00:00:00+04:00`) : null;
  const to = filters.to ? new Date(`${filters.to}T23:59:59.999+04:00`) : null;

  return leads.filter((lead) => {
    const submittedAt = new Date(lead.submitted_at);
    if (
      search &&
      ![lead.name, lead.phone, lead.profile?.email, leadService(lead), leadPackage(lead)]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase("az").includes(search))
    ) return false;
    if (filters.status && filters.status !== "all" && lead.status !== filters.status) return false;
    if (filters.service && filters.service !== "all" && leadService(lead) !== filters.service) return false;
    if (filters.package && filters.package !== "all" && leadPackage(lead) !== filters.package) return false;
    if (from && submittedAt < from) return false;
    if (to && submittedAt > to) return false;
    if (filters.attention === "high" && lead.profile?.priority !== "high") return false;
    if (
      filters.attention === "overdue" &&
      (!lead.next_follow_up_at ||
        new Date(lead.next_follow_up_at) > now ||
        ["won", "closed"].includes(lead.status))
    ) return false;
    if (filters.attention === "unread" && lead.profile?.readAt) return false;
    return true;
  });
}
