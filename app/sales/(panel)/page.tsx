import Link from "next/link";
import { requireRole } from "@/lib/auth/access";
import type { AdminTask, SalesCustomer } from "@/lib/database.types";

const customerStatusLabel: Record<string, string> = {
  new: "Yeni", contacted: "Əlaqə saxlanılıb", interested: "Maraqlanır",
  proposal: "Təklif verilib", won: "Müştəri oldu", lost: "Bağlandı",
};

export default async function SalesDashboardPage() {
  const { supabase, member } = await requireRole("sales", "/sales/login");
  const [customerResult, taskResult] = await Promise.all([
    supabase.from("sales_customers").select("*").eq("representative_id", member.id).order("created_at", { ascending: false }),
    supabase.from("admin_tasks").select("*").eq("assignee_id", member.id).neq("status", "done").order("deadline"),
  ]);
  const customers = (customerResult.data ?? []) as SalesCustomer[];
  const tasks = (taskResult.data ?? []) as AdminTask[];
  const won = customers.filter((customer) => customer.status === "won");
  const active = customers.filter((customer) => !["won", "lost"].includes(customer.status));
  const pipeline = active.reduce((sum, customer) => sum + Number(customer.potential_value || 0), 0);

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div><span className="admin-eyebrow">Şəxsi satış iş sahəsi</span><h1>Salam, {member.name.split(" ")[0]}</h1><p>Müştəriləriniz və gündəlik prioritetləriniz bir baxışda.</p></div>
        <Link href="/sales/customers#new-customer" className="admin-button admin-button--primary">+ Müştəri əlavə et</Link>
      </div>
      <section className="admin-stats sales-stats">
        <article className="admin-stat--accent"><span>Müştərilərim</span><strong>{customers.length}</strong><small>Ümumi qeyd</small></article>
        <article><span>Aktiv danışıqlar</span><strong>{active.length}</strong><small>Satış prosesində</small></article>
        <article><span>Qazanılan</span><strong>{won.length}</strong><small>Müştəriyə çevrilib</small></article>
        <article><span>Satış potensialı</span><strong>${pipeline.toLocaleString("en-US")}</strong><small>Açıq imkanların cəmi</small></article>
      </section>
      <div className="sales-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel__header"><div><h2>Son müştərilər</h2><p>Ən son əlavə etdiyiniz qeydlər</p></div><Link href="/sales/customers">Hamısı →</Link></div>
          {customers.slice(0, 5).map((customer) => (
            <div className="sales-compact-row" key={customer.id}>
              <b>{customer.name.slice(0, 1).toUpperCase()}</b>
              <span><strong>{customer.name}</strong><small>{customer.phone}</small></span>
              <i>{customerStatusLabel[customer.status]}</i>
            </div>
          ))}
          {!customers.length ? <div className="admin-empty">Hələ müştəri əlavə edilməyib.</div> : null}
        </section>
        <section className="admin-panel">
          <div className="admin-panel__header"><div><h2>Açıq tapşırıqlar</h2><p>Sizə təyin olunan işlər</p></div><Link href="/sales/tasks">Hamısı →</Link></div>
          {tasks.slice(0, 5).map((task) => (
            <div className="sales-compact-row" key={task.id}>
              <b>✓</b><span><strong>{task.title}</strong><small>{new Date(task.deadline).toLocaleString("az-AZ")}</small></span>
              <i>{task.status === "in_progress" ? "İş gedir" : "Gözləyir"}</i>
            </div>
          ))}
          {!tasks.length ? <div className="admin-empty">Açıq tapşırıq yoxdur.</div> : null}
        </section>
      </div>
    </main>
  );
}
