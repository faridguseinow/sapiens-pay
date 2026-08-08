import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsProduct, Lead, MarketingCampaign, MarketingSource, TeamMember } from "@/lib/database.types";
import { deleteLead, updateLead } from "../../../actions";
import { MarkLeadRead } from "./mark-read";

const contactLabels: Record<string, string> = {
  call: "Telefon zəngi",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
};

const sourceLabels: Record<string, string> = {
  "pricing-card": "Paket kartından",
  "country-card": "Ölkə seçimindən",
  "payment-system-card": "Ödəniş sistemi kartından",
  hero: "Xidmət səhifəsinin yuxarı hissəsindən",
  "bottom-cta": "Xidmət səhifəsinin sonundan",
  "homepage-cta": "Ana səhifədən",
  "homepage-services-cta": "Ana səhifənin xidmətlər hissəsindən",
  consultation: "Ümumi müraciət düyməsindən",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, sourcesResult, campaignsResult, productsResult, teamResult] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).single(),
    supabase.from("marketing_sources").select("*").eq("is_active", true).order("name"),
    supabase.from("marketing_campaigns").select("*").order("name"),
    supabase.from("analytics_products").select("*").eq("is_active", true).order("name"),
    supabase.from("team_members").select("*").eq("is_active", true).order("name"),
  ]);
  if (!data) notFound();

  const lead = data as Lead;
  const profile = lead.profile ?? {};
  const isLegacyLead = !profile.service;
  const sourceLabel = lead.source_label || profile.sourceLabel || "";
  const sources = (sourcesResult.data ?? []) as MarketingSource[];
  const campaigns = (campaignsResult.data ?? []) as MarketingCampaign[];
  const products = (productsResult.data ?? []) as AnalyticsProduct[];
  const team = (teamResult.data ?? []) as TeamMember[];
  const localFollowUp = lead.next_follow_up_at
    ? new Date(lead.next_follow_up_at).toISOString().slice(0, 16)
    : "";

  return (
    <main className="admin-main">
      <MarkLeadRead id={lead.id} isUnread={!profile.readAt} />
      <div className="admin-page-heading">
        <div>
          <Link href="/admin/leads" className="admin-back">
            ← Müraciətlərə qayıt
          </Link>
          <h1>{lead.name}</h1>
          <p>
            {lead.phone} · {lead.locale.toUpperCase()} ·{" "}
            {new Date(lead.submitted_at).toLocaleString("az-AZ")}
          </p>
        </div>
        <div className="admin-heading-actions">
          <a className="admin-button" href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          {profile.email ? <a className="admin-button" href={`mailto:${profile.email}`}>E-poçt</a> : null}
          <a className="admin-button admin-button--primary" href={`tel:${lead.phone}`}>Zəng et</a>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div className="admin-detail-content">
          <section className="admin-panel admin-info-panel">
            <div className="admin-panel__header">
              <div>
                <h2>Müştəri profili</h2>
                <p>Müraciətdən alınan əsas məlumatlar</p>
              </div>
              <strong>{lead.service_name || profile.service || "Ümumi müraciət"}</strong>
            </div>
            <dl className="admin-definition-grid">
              <div>
                <dt>E-poçt</dt>
                <dd>{profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : "—"}</dd>
              </div>
              <div>
                <dt>Paket / istiqamət</dt>
                <dd>{lead.package_name || profile.package || "Dəqiqləşdirilməyib"}</dd>
              </div>
              <div>
                <dt>Əlaqə üsulu</dt>
                <dd>{contactLabels[lead.preferred_contact ?? ""] || lead.preferred_contact || "—"}</dd>
              </div>
              {profile.businessStatus ? <div><dt>Şirkət statusu</dt><dd>{profile.businessStatus}</dd></div> : null}
              {profile.timeline ? <div><dt>Başlama vaxtı</dt><dd>{profile.timeline}</dd></div> : null}
              {profile.details ? <div><dt>Müştərinin mesajı</dt><dd>{profile.details}</dd></div> : null}
              {sourceLabel ? <div><dt>Müraciət yeri</dt><dd>{sourceLabels[sourceLabel] || "Saytdakı müraciət düyməsindən"}</dd></div> : null}
            </dl>
          </section>

          {isLegacyLead ? <section className="admin-panel">
            <div className="admin-panel__header">
              <div>
                <h2>Əvvəlki formanın cavabları</h2>
                <p>Köhnə müraciətdən qalan məlumatlar</p>
              </div>
            </div>
            <div className="admin-answers">
              {(lead.answers ?? []).map((item, index) => (
                <div key={`${item.question}-${index}`}>
                  <span>{item.question}</span>
                  <strong>{item.answer}</strong>
                </div>
              ))}
            </div>
          </section> : null}
        </div>

        <aside className="admin-panel admin-lead-editor">
          <h2>Müraciəti idarə et</h2>
          <form action={updateLead} className="admin-form">
            <input type="hidden" name="id" value={lead.id} />
            <label>
              <span>Mərhələ</span>
              <select name="status" defaultValue={lead.status}>
                <option value="new">Yeni</option>
                <option value="contacted">Əlaqə saxlanılıb</option>
                <option value="qualified">Maraqlanır</option>
                <option value="won">Müştəri oldu</option>
                <option value="closed">Uyğun deyil</option>
              </select>
            </label>
            <label>
              <span>Prioritet</span>
              <select name="priority" defaultValue={profile.priority ?? "medium"}>
                <option value="high">Yüksək</option>
                <option value="medium">Orta</option>
                <option value="low">Aşağı</option>
              </select>
            </label>
            <label><span>Marketinq mənbəyi</span><select name="sourceId" defaultValue={lead.source_id ?? ""}><option value="">Mənbə yoxdur</option>{sources.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>Kampaniya</span><select name="campaignId" defaultValue={lead.campaign_id ?? ""}><option value="">Kampaniya yoxdur</option>{campaigns.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>Məhsul</span><select name="productId" defaultValue={lead.product_id ?? ""}><option value="">Məhsul seçilməyib</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>SDR</span><select name="assignedSdrId" defaultValue={lead.assigned_sdr_id ?? ""}><option value="">Təyin edilməyib</option>{team.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>Satış meneceri</span><select name="assignedSalesId" defaultValue={lead.assigned_sales_id ?? ""}><option value="">Təyin edilməyib</option>{team.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>Potensial satış məbləği (AZN)</span><input type="number" min="0" step="0.01" name="dealValue" defaultValue={lead.deal_value ?? ""} /></label>
            <label>
              <span>Növbəti əlaqə</span>
              <input type="datetime-local" name="nextFollowUpAt" defaultValue={localFollowUp} />
            </label>
            <label>
              <span>Daxili qeydlər</span>
              <textarea
                name="notes"
                rows={7}
                defaultValue={lead.notes ?? ""}
                placeholder="Danışıq nəticəsi, növbəti addım..."
              />
            </label>
            <button className="admin-button admin-button--primary">Yadda saxla</button>
          </form>
          <form action={deleteLead}>
            <input type="hidden" name="id" value={lead.id} />
            <button className="admin-button admin-button--danger">Müraciəti sil</button>
          </form>
        </aside>
      </div>
    </main>
  );
}
