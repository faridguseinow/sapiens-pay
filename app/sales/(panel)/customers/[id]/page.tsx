import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/access";
import { SAPIENS_SERVICES } from "@/lib/services";
import type { MarketingSource, SalesCustomer } from "@/lib/database.types";
import { SALES_STATUSES, bakuDateTimeLocal } from "@/lib/sales";
import { TaskSubmitButton } from "@/app/admin/(panel)/tasks/task-submit-button";
import { updateSalesCustomer } from "../actions";

export default async function SalesCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, member } = await requireRole("sales", "/sales/login");
  const [customerResult, sourceResult] = await Promise.all([
    supabase.from("sales_customers").select("*").eq("id", id).eq("representative_id", member.id).maybeSingle(),
    supabase.from("marketing_sources").select("*").eq("is_active", true).order("name"),
  ]);
  if (customerResult.error || sourceResult.error) throw new Error("Müştəri məlumatları yüklənmədi.");
  if (!customerResult.data) notFound();
  const customer = customerResult.data as SalesCustomer;
  const sources = (sourceResult.data ?? []) as MarketingSource[];

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div><Link href="/sales/customers" className="admin-back">← Müştərilərə qayıt</Link><h1>{customer.name}</h1><p>{customer.phone}{customer.email ? ` · ${customer.email}` : ""}</p></div>
        <div className="admin-heading-actions"><a href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="admin-button">WhatsApp</a><a href={`tel:${customer.phone}`} className="admin-button admin-button--primary">Zəng et</a></div>
      </div>
      <section className="admin-panel">
        <div className="admin-panel__header"><div><h2>Müştəri məlumatlarını yenilə</h2><p>Satış mərhələsi və növbəti addım</p></div></div>
        <form action={updateSalesCustomer} className="sales-customer-form">
          <input type="hidden" name="id" value={customer.id} />
          <label><span>Ad, soyad *</span><input name="name" required maxLength={180} defaultValue={customer.name} /></label>
          <label><span>Telefon *</span><input name="phone" required maxLength={50} defaultValue={customer.phone} /></label>
          <label><span>E-poçt</span><input name="email" type="email" maxLength={254} defaultValue={customer.email ?? ""} /></label>
          <label><span>Xidmət</span><select name="serviceKey" defaultValue={customer.service_key}>{SAPIENS_SERVICES.map((service) => <option key={service.key} value={service.key}>{service.label}</option>)}</select></label>
          <label><span>Mərhələ</span><select name="status" defaultValue={customer.status}>{SALES_STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
          <label><span>Mənbə</span><select name="sourceId" defaultValue={customer.source_id ?? ""}><option value="">Mənbə seçilməyib</option>{sources.map((source) => <option key={source.id} value={source.id}>{source.name}</option>)}</select></label>
          <label><span>Potensial, AZN</span><input name="potentialValue" type="number" min="0" step="0.01" defaultValue={customer.potential_value} /></label>
          <label><span>Növbəti əlaqə</span><input name="nextContactAt" type="datetime-local" defaultValue={bakuDateTimeLocal(customer.next_contact_at)} /></label>
          <label className="sales-customer-form__wide"><span>Qeyd</span><textarea name="notes" rows={6} maxLength={5000} defaultValue={customer.notes ?? ""} /></label>
          <TaskSubmitButton className="admin-button admin-button--primary" pendingLabel="Yadda saxlanılır...">Yadda saxla</TaskSubmitButton>
        </form>
      </section>
    </main>
  );
}
