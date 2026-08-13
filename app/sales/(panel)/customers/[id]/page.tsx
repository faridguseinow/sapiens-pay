import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/access";
import { SAPIENS_SERVICES } from "@/lib/services";
import type { SalesCustomer, SalesCustomerStatus } from "@/lib/database.types";
import { updateSalesCustomer } from "../actions";

const statuses: { value: SalesCustomerStatus; label: string }[] = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Əlaqə saxlanılıb" },
  { value: "interested", label: "Maraqlanır" },
  { value: "proposal", label: "Təklif verilib" },
  { value: "won", label: "Müştəri oldu" },
  { value: "lost", label: "Bağlandı" },
];

export default async function SalesCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, member } = await requireRole("sales", "/sales/login");
  const { data } = await supabase
    .from("sales_customers")
    .select("*")
    .eq("id", id)
    .eq("representative_id", member.id)
    .maybeSingle();
  if (!data) notFound();
  const customer = data as SalesCustomer;

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
          <label><span>Ad, soyad *</span><input name="name" required defaultValue={customer.name} /></label>
          <label><span>Telefon *</span><input name="phone" required defaultValue={customer.phone} /></label>
          <label><span>E-poçt</span><input name="email" type="email" defaultValue={customer.email ?? ""} /></label>
          <label><span>Xidmət</span><select name="serviceKey" defaultValue={customer.service_key}>{SAPIENS_SERVICES.map((service) => <option key={service.key} value={service.key}>{service.label}</option>)}</select></label>
          <label><span>Mərhələ</span><select name="status" defaultValue={customer.status}>{statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
          <label><span>Potensial, AZN</span><input name="potentialValue" type="number" min="0" step="0.01" defaultValue={customer.potential_value} /></label>
          <label><span>Növbəti əlaqə</span><input name="nextContactAt" type="datetime-local" defaultValue={customer.next_contact_at ? new Date(customer.next_contact_at).toISOString().slice(0, 16) : ""} /></label>
          <label className="sales-customer-form__wide"><span>Qeyd</span><textarea name="notes" rows={6} defaultValue={customer.notes ?? ""} /></label>
          <button className="admin-button admin-button--primary">Yadda saxla</button>
        </form>
      </section>
    </main>
  );
}
