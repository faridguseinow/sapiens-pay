import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/database.types";
import { LeadsBoard } from "./board-client";

export default async function LeadsBoardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);
  const leads = (data ?? []) as Lead[];

  return (
    <main className="admin-main admin-main--wide">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Satış axını</span>
          <h1>Satış lövhəsi</h1>
          <p>Kartları sürüşdürərək mərhələni dəyişin və vacib müraciətləri önə çıxarın.</p>
        </div>
        <div className="admin-view-switch">
          <Link href="/admin/leads">Siyahı</Link>
          <span className="admin-view-switch__active">Satış lövhəsi</span>
          <span className="admin-count">{leads.length} müraciət</span>
        </div>
      </div>
      <LeadsBoard initialLeads={leads} />
    </main>
  );
}
