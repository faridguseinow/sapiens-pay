import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/database.types";

const statusLabel: Record<string, string> = {
  new: "Yeni",
  contacted: "Əlaqə saxlanılıb",
  qualified: "Maraqlanır",
  won: "Müştəri",
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

function bakuDateKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Baku",
  }).format(value);
}

function countBy(leads: Lead[], getLabel: (lead: Lead) => string | undefined) {
  const counts = new Map<string, number>();
  for (const lead of leads) {
    const label = getLabel(lead)?.trim();
    if (!label) continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "az"));
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [leadsResult, postsResult] = await Promise.all([
    supabase.from("leads").select("*").order("submitted_at", { ascending: false }),
    supabase.from("posts").select("id,status", { count: "exact" }),
  ]);

  const leads = (leadsResult.data ?? []) as Lead[];
  const posts = postsResult.data ?? [];
  const recentLeads = leads.slice(0, 5);
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const publishedPosts = posts.filter((post) => post.status === "published").length;
  const now = new Date();
  const todayKey = bakuDateKey(now);
  const monthKey = todayKey.slice(0, 7);
  const sevenDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  const todayCount = leads.filter((lead) => bakuDateKey(new Date(lead.submitted_at)) === todayKey).length;
  const weekCount = leads.filter((lead) => new Date(lead.submitted_at) >= sevenDaysAgo).length;
  const monthCount = leads.filter((lead) => bakuDateKey(new Date(lead.submitted_at)).startsWith(monthKey)).length;
  const wonCount = leads.filter((lead) => lead.status === "won").length;
  const conversionRate = leads.length ? Math.round((wonCount / leads.length) * 100) : 0;
  const serviceStats = countBy(
    leads,
    (lead) => lead.service_name || lead.profile?.service || "Ümumi müraciət",
  );
  const packageStats = countBy(
    leads,
    (lead) => lead.package_name || lead.profile?.package,
  );
  const maxServiceCount = Math.max(...serviceStats.map((item) => item.count), 1);
  const maxPackageCount = Math.max(...packageStats.map((item) => item.count), 1);

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Bu gün nə baş verir?</span>
          <h1>Ümumi baxış</h1>
          <p>Əsas göstəricilər və son müraciətlər bir baxışda.</p>
        </div>
        <Link href="/admin/blog/new" className="admin-button admin-button--primary">
          + Yeni yazı
        </Link>
      </div>

      <section className="admin-stats">
        <article>
          <span>Ümumi müraciət</span>
          <strong>{leads.length}</strong>
          <small>Bütün müraciətlər</small>
        </article>
        <article className="admin-stat--accent">
          <span>Bu gün</span>
          <strong>{todayCount}</strong>
          <small>Bu gün daxil olub</small>
        </article>
        <article>
          <span>Son 7 gün</span>
          <strong>{weekCount}</strong>
          <small>Son bir həftə</small>
        </article>
        <article>
          <span>Bu ay</span>
          <strong>{monthCount}</strong>
          <small>Cari ay üzrə</small>
        </article>
        <article>
          <span>Əlaqə gözləyən</span>
          <strong>{newLeads}</strong>
          <small>Yeni müraciətlər</small>
        </article>
        <article>
          <span>Müştəriyə çevrilmə</span>
          <strong>{conversionRate}%</strong>
          <small>{wonCount} nəfər müştəri olub</small>
        </article>
      </section>

      <section className="admin-analytics-grid">
        <article className="admin-panel admin-breakdown">
          <div className="admin-panel__header">
            <div>
              <h2>Xidmətlər üzrə müraciətlər</h2>
              <p>Hansı xidmətə daha çox maraq var</p>
            </div>
          </div>
          {serviceStats.length ? (
            <div className="admin-breakdown__list">
              {serviceStats.map((item) => (
                <div className="admin-breakdown__item" key={item.label}>
                  <div><span>{item.label}</span><strong>{item.count}</strong></div>
                  <span><i style={{ width: `${(item.count / maxServiceCount) * 100}%` }} /></span>
                </div>
              ))}
            </div>
          ) : <div className="admin-empty">Statistika üçün müraciət yoxdur.</div>}
        </article>

        <article className="admin-panel admin-breakdown">
          <div className="admin-panel__header">
            <div>
              <h2>Paketlər üzrə maraq</h2>
              <p>Ən çox seçilən paket və istiqamətlər</p>
            </div>
          </div>
          {packageStats.length ? (
            <div className="admin-breakdown__list">
              {packageStats.map((item) => (
                <div className="admin-breakdown__item" key={item.label}>
                  <div><span>{item.label}</span><strong>{item.count}</strong></div>
                  <span><i style={{ width: `${(item.count / maxPackageCount) * 100}%` }} /></span>
                </div>
              ))}
            </div>
          ) : <div className="admin-empty">Hələ paket seçimi yoxdur.</div>}
        </article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <h2>Son müraciətlər</h2>
            <p>Saytdan daxil olan son müraciətlər</p>
          </div>
          <Link href="/admin/leads">Hamısına bax →</Link>
        </div>
        {recentLeads.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Müştəri</th>
                  <th>Xidmət</th>
                  <th>Paket</th>
                  <th>Status</th>
                  <th>Tarix</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => {
                  const submittedAt = formatSubmittedAt(lead.submitted_at);
                  return <tr key={lead.id}>
                    <td>
                      <Link href={`/admin/leads/${lead.id}`} className="admin-person">
                        <b>{lead.name.slice(0, 1).toUpperCase()}</b>
                        <span>
                          {lead.name}
                          {lead.profile?.email ? <small>{lead.profile.email}</small> : null}
                        </span>
                      </Link>
                    </td>
                    <td>{lead.service_name || lead.profile?.service || "Ümumi müraciət"}</td>
                    <td>{lead.package_name || lead.profile?.package || "—"}</td>
                    <td>
                      <span className={`admin-status admin-status--${lead.status}`}>
                        {statusLabel[lead.status]}
                      </span>
                    </td>
                    <td>
                      <span className="admin-date">
                        <span>{submittedAt.date}</span>
                        <small>{submittedAt.time}</small>
                      </span>
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">Hələ müraciət daxil olmayıb.</div>
        )}
      </section>

      <p className="admin-dashboard-note">
        Bloqda {postsResult.count ?? posts.length} yazı var, onlardan {publishedPosts} ədədi yayımlanıb.
      </p>
    </main>
  );
}
