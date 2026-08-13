import Link from "next/link";
import { requireRole } from "@/lib/auth/access";
import { salesLogout } from "../actions";

export default async function SalesPanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, claims, member } = await requireRole("sales", "/sales/login");
  const [{ count: unseenTasks }, { count: dueCustomers }] = await Promise.all([
    supabase
      .from("admin_tasks")
      .select("id", { count: "exact", head: true })
      .eq("assignee_id", member.id)
      .is("archived_at", null)
      .neq("status", "done")
      .is("seen_at", null),
    supabase
      .from("sales_customers")
      .select("id", { count: "exact", head: true })
      .eq("representative_id", member.id)
      .not("next_contact_at", "is", null)
      .lte("next_contact_at", new Date().toISOString())
      .not("status", "in", '("won","lost")'),
  ]);

  return (
    <div className="admin-shell sales-shell">
      <aside className="admin-sidebar sales-sidebar">
        <Link href="/sales" className="admin-brand admin-sidebar__brand"><span>sapiens</span><b>pay</b></Link>
        <div className="sales-sidebar__role">Satış paneli</div>
        <nav className="admin-nav" aria-label="Satış naviqasiyası">
          <Link href="/sales"><span>⌂</span>İcmal</Link>
          <Link href="/sales/customers">
            <span>◎</span>Müştərilər
            {dueCustomers ? <b className="admin-nav__badge">{dueCustomers}</b> : null}
          </Link>
          <Link href="/sales/tasks">
            <span>✓</span>Tapşırıqlar
            {unseenTasks ? <b className="admin-nav__badge">{unseenTasks}</b> : null}
          </Link>
        </nav>
        <div className="admin-sidebar__bottom">
          <form action={salesLogout}><button>Çıxış et</button></form>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div><span className="admin-topbar__dot" />{member.name}</div>
          <span>{typeof claims?.email === "string" ? claims.email : member.email}</span>
        </header>
        {children}
      </div>
    </div>
  );
}
