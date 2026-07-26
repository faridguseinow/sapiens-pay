import { requireRole } from "@/lib/auth/access";
import { serviceLabel } from "@/lib/services";
import type { SalesCustomer, TeamMember } from "@/lib/database.types";

const statusLabel: Record<string, string> = {
  new: "Yeni", contacted: "Əlaqə saxlanılıb", interested: "Maraqlanır",
  proposal: "Təklif verilib", won: "Müştəri oldu", lost: "Bağlandı",
};

export default async function AdminSalesPage() {
  const { supabase } = await requireRole("admin", "/admin/login");
  const [customerResult, repsResult] = await Promise.all([
    supabase.from("sales_customers").select("*, representative:team_members(*)").order("created_at", { ascending: false }),
    supabase.from("team_members").select("*").eq("role", "sales").order("name"),
  ]);
  const customers = (customerResult.data ?? []) as SalesCustomer[];
  const reps = (repsResult.data ?? []) as TeamMember[];
  const active = customers.filter((customer) => !["won", "lost"].includes(customer.status));
  const won = customers.filter((customer) => customer.status === "won");
  const pipeline = active.reduce((sum, customer) => sum + Number(customer.potential_value || 0), 0);
  const conversion = customers.length ? Math.round((won.length / customers.length) * 100) : 0;

  return (
    <main className="admin-main">
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Satış komandası</span><h1>Satış CRM</h1><p>Bütün təmsilçilər, müştərilər və satış göstəriciləri.</p></div><span className="admin-count">{reps.length} satış təmsilçisi</span></div>
      <section className="admin-stats sales-stats">
        <article className="admin-stat--accent"><span>Ümumi müştəri</span><strong>{customers.length}</strong><small>Təmsilçilərin bütün qeydləri</small></article>
        <article><span>Aktiv imkanlar</span><strong>{active.length}</strong><small>Satış prosesində</small></article>
        <article><span>Qazanılan</span><strong>{won.length}</strong><small>Müştəriyə çevrilib</small></article>
        <article><span>Konversiya</span><strong>{conversion}%</strong><small>Ümumi nəticə</small></article>
        <article><span>Pipeline</span><strong>${pipeline.toLocaleString("en-US")}</strong><small>Açıq potensial</small></article>
      </section>

      <section className="admin-panel sales-rep-performance">
        <div className="admin-panel__header"><div><h2>Təmsilçi göstəriciləri</h2><p>Komanda üzrə müqayisə</p></div></div>
        <div className="sales-rep-grid">{reps.map((rep) => {
          const own = customers.filter((customer) => customer.representative_id === rep.id);
          const ownWon = own.filter((customer) => customer.status === "won").length;
          return <article key={rep.id}><b>{rep.name.slice(0, 1).toUpperCase()}</b><div><strong>{rep.name}</strong><small>{rep.email}</small></div><span><em>{own.length}</em> müştəri</span><span><em>{ownWon}</em> satış</span></article>;
        })}{!reps.length ? <div className="admin-empty">Satış təmsilçisi təyin edilməyib.</div> : null}</div>
      </section>

      <section className="admin-panel" style={{ marginTop: 20 }}>
        <div className="admin-panel__header"><div><h2>Bütün satış müştəriləri</h2><p>Təmsilçilərin daxil etdiyi məlumatlar</p></div></div>
        {customers.length ? <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>Müştəri</th><th>Təmsilçi</th><th>Xidmət</th><th>Status</th><th>Potensial</th><th>Növbəti əlaqə</th></tr></thead>
          <tbody>{customers.map((customer) => <tr key={customer.id}>
            <td><div className="admin-person"><b>{customer.name.slice(0, 1).toUpperCase()}</b><span><strong>{customer.name}</strong><small>{customer.phone}</small>{customer.email ? <small>{customer.email}</small> : null}</span></div></td>
            <td>{customer.representative?.name ?? "—"}</td>
            <td>{serviceLabel(customer.service_key)}</td>
            <td><span className={`sales-status sales-status--${customer.status}`}>{statusLabel[customer.status]}</span></td>
            <td>${Number(customer.potential_value).toLocaleString("en-US")}</td>
            <td>{customer.next_contact_at ? new Date(customer.next_contact_at).toLocaleString("az-AZ") : "—"}</td>
          </tr>)}</tbody>
        </table></div> : <div className="admin-empty">Satış müştərisi əlavə edilməyib.</div>}
      </section>
    </main>
  );
}
