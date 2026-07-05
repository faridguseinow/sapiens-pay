import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/database.types";
import {
  filterLeads,
  leadPackage,
  leadService,
  type LeadFilters,
} from "@/lib/admin-leads";

const statusLabels: Record<string, string> = {
  new: "Yeni",
  contacted: "Əlaqə saxlanılıb",
  qualified: "Maraqlanır",
  won: "Müştəri oldu",
  closed: "Uyğun deyil",
};

function formatSubmittedAt(value: string) {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat("az-AZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Baku",
    }).format(date),
    time: new Intl.DateTimeFormat("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Baku",
    }).format(date),
  };
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<LeadFilters>;
}) {
  const filters = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw new Error(error.message);
  const allLeads = (data ?? []) as Lead[];
  const leads = filterLeads(allLeads, filters);
  const services = [...new Set(allLeads.map(leadService))].sort((a, b) => a.localeCompare(b, "az"));
  const packages = [...new Set(allLeads.map(leadPackage).filter(Boolean))].sort((a, b) => a.localeCompare(b, "az"));
  const exportParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== "all") exportParams.set(key, value);
  }
  const currentTime = new Date().getTime();
  const unreadCount = allLeads.filter((lead) => !lead.profile?.readAt).length;
  const dueCount = allLeads.filter(
    (lead) =>
      lead.next_follow_up_at &&
      new Date(lead.next_follow_up_at).getTime() <= currentTime &&
      !["won", "closed"].includes(lead.status),
  ).length;

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Müştəri müraciətləri</span>
          <h1>Müraciətlər</h1>
          <p>Müştərilərlə əlaqəni və növbəti addımları rahat idarə edin.</p>
        </div>
        <div className="admin-view-switch">
          <span className="admin-view-switch__active">Siyahı</span>
          <Link href="/admin/leads/board">Satış lövhəsi</Link>
          <a href={`/api/admin/leads/export?${exportParams.toString()}`}>CSV yüklə</a>
          <span className="admin-count">{leads.length} nəticə</span>
        </div>
      </div>

      {unreadCount || dueCount ? (
        <section className="admin-notification-strip" aria-label="Bildirişlər">
          {unreadCount ? <span><b>{unreadCount}</b> oxunmamış müraciət</span> : null}
          {dueCount ? <span className="admin-notification-strip__due"><b>{dueCount}</b> əlaqə vaxtı çatıb</span> : null}
        </section>
      ) : null}

      <form className="admin-filters admin-filters--advanced">
        <label className="admin-filter-search">
          <span>Axtarış</span>
          <input name="q" defaultValue={filters.q} placeholder="Ad, telefon, e-poçt, xidmət..." />
        </label>
        <label>
          <span>Mərhələ</span>
          <select name="status" defaultValue={filters.status ?? "all"}>
            <option value="all">Hamısı</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Xidmət</span>
          <select name="service" defaultValue={filters.service ?? "all"}>
            <option value="all">Bütün xidmətlər</option>
            {services.map((service) => <option key={service}>{service}</option>)}
          </select>
        </label>
        <label>
          <span>Paket</span>
          <select name="package" defaultValue={filters.package ?? "all"}>
            <option value="all">Bütün paketlər</option>
            {packages.map((packageName) => <option key={packageName}>{packageName}</option>)}
          </select>
        </label>
        <label>
          <span>Başlanğıc tarixi</span>
          <input type="date" name="from" defaultValue={filters.from} />
        </label>
        <label>
          <span>Son tarix</span>
          <input type="date" name="to" defaultValue={filters.to} />
        </label>
        <label>
          <span>Diqqət tələb edən</span>
          <select name="attention" defaultValue={filters.attention ?? "all"}>
            <option value="all">Hamısı</option>
            <option value="unread">Oxunmamış</option>
            <option value="high">Yüksək prioritet</option>
            <option value="overdue">Əlaqə vaxtı keçib</option>
          </select>
        </label>
        <div className="admin-filter-actions">
          <button className="admin-button admin-button--primary">Tətbiq et</button>
          <Link href="/admin/leads" className="admin-button">Təmizlə</Link>
        </div>
      </form>

      <section className="admin-panel">
        {leads.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Müştəri</th>
                  <th>Xidmət</th>
                  <th>Paket / istiqamət</th>
                  <th>Status</th>
                  <th>Tarix</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const submittedAt = formatSubmittedAt(lead.submitted_at);
                  return <tr key={lead.id} className={!lead.profile?.readAt ? "admin-row--unread" : undefined}>
                    <td>
                      <div className="admin-person">
                        <b>{lead.name.slice(0, 1).toUpperCase()}</b>
                        <span>
                          <strong>{lead.name}</strong>
                          {!lead.profile?.readAt ? <em>Yeni</em> : null}
                          <small>{lead.phone}</small>
                          {lead.profile?.email ? <small>{lead.profile.email}</small> : null}
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong>{leadService(lead)}</strong>
                    </td>
                    <td>{leadPackage(lead) || "—"}</td>
                    <td>
                      <span className={`admin-status admin-status--${lead.status}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td>
                      <span className="admin-date">
                        <span>{submittedAt.date}</span>
                        <small>{submittedAt.time}</small>
                      </span>
                    </td>
                    <td className="admin-row-actions">
                      <a href={`tel:${lead.phone}`} title="Zəng et">☎</a>
                      <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" title="WhatsApp">WA</a>
                      {lead.profile?.email ? <a href={`mailto:${lead.profile.email}`} title="E-poçt yaz">✉</a> : null}
                      <Link href={`/admin/leads/${lead.id}`} className="admin-row-link">Aç →</Link>
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">Bu filtrə uyğun müraciət yoxdur.</div>
        )}
      </section>
    </main>
  );
}
