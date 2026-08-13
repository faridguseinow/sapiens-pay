import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/access";
import { SAPIENS_SERVICES } from "@/lib/services";
import type { MarketingSource, SalesCustomer, SalesCustomerStatus, TeamMember } from "@/lib/database.types";
import { TaskSubmitButton } from "../../tasks/task-submit-button";
import { updateSalesCustomerAsAdmin } from "../actions";
import { SALES_SOURCE_KEYS, bakuDateTimeLocal, salesSourceLabel } from "@/lib/sales";

const statuses: { value: SalesCustomerStatus; label: string }[] = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Əlaqə saxlanılıb" },
  { value: "interested", label: "Maraqlanır" },
  { value: "proposal", label: "Təklif verilib" },
  { value: "won", label: "Müştəri oldu" },
  { value: "lost", label: "Bağlandı" },
];

export default async function AdminSalesCustomerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireRole("admin", "/admin/login");
  const [customerResult, representativesResult, sourceResult] = await Promise.all([
    supabase.from("sales_customers").select("*").eq("id", id).maybeSingle(),
    supabase.from("team_members").select("*").eq("role", "sales").eq("is_active", true).order("name"),
    supabase.from("marketing_sources").select("*").eq("is_active", true).in("key", [...SALES_SOURCE_KEYS]),
  ]);
  if (customerResult.error) throw new Error("Müştəri məlumatları yüklənmədi.");
  if (!customerResult.data) notFound();
  if (representativesResult.error) throw new Error("Satış təmsilçiləri yüklənmədi.");
  if (sourceResult.error) throw new Error("Mənbələr yüklənmədi.");
  const customer = customerResult.data as SalesCustomer;
  const representatives = (representativesResult.data ?? []) as TeamMember[];
  const sources = ((sourceResult.data ?? []) as MarketingSource[]).sort((a, b) => SALES_SOURCE_KEYS.indexOf(a.key as (typeof SALES_SOURCE_KEYS)[number]) - SALES_SOURCE_KEYS.indexOf(b.key as (typeof SALES_SOURCE_KEYS)[number]));

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div><Link href="/admin/sales" className="admin-back">← Satış CRM-ə qayıt</Link><h1>{customer.name}</h1><p>{customer.phone}{customer.email ? ` · ${customer.email}` : ""}</p></div>
        <div className="admin-heading-actions"><a href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="admin-button">WhatsApp</a><a href={`tel:${customer.phone}`} className="admin-button admin-button--primary">Zəng et</a></div>
      </div>
      {saved === "1" ? <div className="admin-success-notice">Müştəri məlumatları yeniləndi.</div> : null}
      <section className="admin-panel">
        <div className="admin-panel__header"><div><h2>Müştəri məlumatlarını yenilə</h2><p>Satış təmsilçisi, mərhələ və növbəti addım</p></div></div>
        <form action={updateSalesCustomerAsAdmin} className="sales-customer-form">
          <input type="hidden" name="id" value={customer.id} />
          <label><span>Ad, soyad *</span><input name="name" required maxLength={180} defaultValue={customer.name} /></label>
          <label><span>Telefon *</span><input name="phone" required maxLength={50} defaultValue={customer.phone} /></label>
          <label><span>E-poçt</span><input name="email" type="email" maxLength={254} defaultValue={customer.email ?? ""} /></label>
          <label><span>Satış təmsilçisi *</span><select name="representativeId" required defaultValue={customer.representative_id}>{representatives.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
          <label><span>Xidmət</span><select name="serviceKey" defaultValue={customer.service_key}>{SAPIENS_SERVICES.map((service) => <option key={service.key} value={service.key}>{service.label}</option>)}</select></label>
          <label><span>Mərhələ</span><select name="status" defaultValue={customer.status}>{statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
          <label><span>Mənbə</span><select name="sourceId" defaultValue={customer.source_id ?? ""}><option value="">Mənbə seçilməyib</option>{sources.map((source) => <option key={source.id} value={source.id}>{salesSourceLabel(source.key, source.name)}</option>)}</select></label>
          <label><span>Digər mənbə</span><input name="sourceDetail" maxLength={180} defaultValue={customer.source_detail ?? ""} placeholder="Digər seçmisinizsə, mənbəni yazın" /></label>
          <label><span>Potensial, AZN</span><input name="potentialValue" type="number" min="0" step="0.01" defaultValue={customer.potential_value} /></label>
          <label><span>Növbəti əlaqə</span><input name="nextContactAt" type="datetime-local" defaultValue={bakuDateTimeLocal(customer.next_contact_at)} /></label>
          <label className="sales-customer-form__wide"><span>Qeyd</span><textarea name="notes" rows={6} maxLength={5000} defaultValue={customer.notes ?? ""} /></label>
          <TaskSubmitButton className="admin-button admin-button--primary" pendingLabel="Yadda saxlanılır...">Yadda saxla</TaskSubmitButton>
        </form>
      </section>
    </main>
  );
}
