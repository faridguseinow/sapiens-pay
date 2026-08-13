import Link from "next/link";
import { requireRole } from "@/lib/auth/access";
import { SAPIENS_SERVICES, serviceLabel } from "@/lib/services";
import type { MarketingSource, SalesCustomer } from "@/lib/database.types";
import { SALES_STATUSES } from "@/lib/sales";
import { TaskSubmitButton } from "@/app/admin/(panel)/tasks/task-submit-button";
import { createSalesCustomer } from "./actions";

type CustomerWithSource = SalesCustomer & { source: Pick<MarketingSource, "name"> | null };

export default async function SalesCustomersPage() {
  const { supabase, member } = await requireRole("sales", "/sales/login");
  const [customerResult, sourceResult] = await Promise.all([
    supabase.from("sales_customers").select("*, source:marketing_sources(name)").eq("representative_id", member.id).order("created_at", { ascending: false }),
    supabase.from("marketing_sources").select("*").eq("is_active", true).order("name"),
  ]);
  if (customerResult.error || sourceResult.error) throw new Error("Satış məlumatları yüklənmədi.");
  const customers = (customerResult.data ?? []) as CustomerWithSource[];
  const sources = (sourceResult.data ?? []) as MarketingSource[];

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div><span className="admin-eyebrow">Şəxsi müştəri bazası</span><h1>Müştərilərim</h1><p>Əlaqələri, xidmət marağını və satış mərhələsini qeyd edin.</p></div>
        <span className="admin-count">{customers.length} müştəri</span>
      </div>

      <section className="admin-panel sales-customer-create" id="new-customer">
        <div className="admin-panel__header"><div><h2>Yeni müştəri əlavə et</h2><p>Əsas əlaqə və satış məlumatları</p></div></div>
        <form action={createSalesCustomer} className="sales-customer-form">
          <label><span>Ad, soyad *</span><input name="name" required maxLength={180} placeholder="Müştərinin adı" /></label>
          <label><span>Telefon *</span><input name="phone" required maxLength={50} placeholder="+994 50 000 00 00" /></label>
          <label><span>E-poçt</span><input name="email" type="email" maxLength={254} placeholder="client@example.com" /></label>
          <label><span>Xidmət *</span><select name="serviceKey" required defaultValue=""><option value="" disabled>Xidmət seçin</option>{SAPIENS_SERVICES.map((service) => <option key={service.key} value={service.key}>{service.label}</option>)}</select></label>
          <label><span>Mərhələ *</span><select name="status" required defaultValue="new">{SALES_STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
          <label><span>Mənbə *</span><select name="sourceId" required defaultValue=""><option value="" disabled>Mənbə seçin</option>{sources.map((source) => <option key={source.id} value={source.id}>{source.name}</option>)}</select></label>
          <label><span>Növbəti əlaqə</span><input name="nextContactAt" type="datetime-local" /></label>
          <label className="sales-customer-form__wide"><span>Qeyd</span><textarea name="notes" rows={3} maxLength={5000} placeholder="Danışıq, ehtiyac və növbəti addım..." /></label>
          <TaskSubmitButton className="admin-button admin-button--primary" pendingLabel="Əlavə edilir...">+ Müştəri əlavə et</TaskSubmitButton>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__header"><div><h2>Müştəri cədvəli</h2><p>Yalnız sizə aid müştərilər</p></div></div>
        {customers.length ? <div className="admin-table-wrap"><table className="admin-table sales-customer-table">
          <thead><tr><th>Müştəri</th><th>Xidmət</th><th>Mənbə</th><th>Mərhələ</th><th>Potensial</th><th>Növbəti əlaqə</th><th /></tr></thead>
          <tbody>{customers.map((customer) => <tr key={customer.id}>
            <td><div className="admin-person"><b>{customer.name.slice(0, 1).toUpperCase()}</b><span><strong>{customer.name}</strong><small>{customer.phone}</small>{customer.email ? <small>{customer.email}</small> : null}</span></div></td>
            <td>{serviceLabel(customer.service_key)}</td>
            <td>{customer.source?.name ?? "—"}</td>
            <td><span className={`sales-status sales-status--${customer.status}`}>{SALES_STATUSES.find((item) => item.value === customer.status)?.label}</span></td>
            <td>{Number(customer.potential_value).toLocaleString("az-AZ")} AZN</td>
            <td>{customer.next_contact_at ? new Date(customer.next_contact_at).toLocaleString("az-AZ") : "—"}</td>
            <td><Link className="admin-row-link" href={`/sales/customers/${customer.id}`}>Aç →</Link></td>
          </tr>)}</tbody>
        </table></div> : <div className="admin-empty">Hələ müştəri əlavə edilməyib.</div>}
      </section>
    </main>
  );
}
