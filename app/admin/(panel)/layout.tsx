import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../actions";
import type { Lead } from "@/lib/database.types";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  const email = typeof data.claims.email === "string" ? data.claims.email : "Admin";
  const { data: notificationData } = await supabase
    .from("leads")
    .select("id,status,next_follow_up_at,profile");
  const notificationLeads = (notificationData ?? []) as Pick<
    Lead,
    "id" | "status" | "next_follow_up_at" | "profile"
  >[];
  const currentTime = new Date().getTime();
  const unreadCount = notificationLeads.filter((lead) => !lead.profile?.readAt).length;
  const dueCount = notificationLeads.filter(
    (lead) =>
      lead.next_follow_up_at &&
      new Date(lead.next_follow_up_at).getTime() <= currentTime &&
      !["won", "closed"].includes(lead.status),
  ).length;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand admin-sidebar__brand">
          <span>sapiens</span>
          <b>pay</b>
        </Link>
        <nav className="admin-nav" aria-label="Admin naviqasiyası">
          <Link href="/admin">
            <span>⌂</span>
            İcmal
          </Link>
          <Link href="/admin/leads">
            <span>◎</span>
            Müraciətlər
            {unreadCount ? <b className="admin-nav__badge">{unreadCount}</b> : null}
          </Link>
          <Link href="/admin/blog">
            <span>✦</span>
            Bloq
          </Link>
        </nav>
        <div className="admin-sidebar__bottom">
          <Link href="/az" target="_blank" aria-label="Sayta bax" title="Sayta bax">
            Sayta bax ↗
          </Link>
          <form action={logout}>
            <button aria-label="Çıxış et" title="Çıxış et">
              Çıxış et
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar__dot" />
            {unreadCount || dueCount
              ? `${unreadCount} oxunmamış · ${dueCount} əlaqə vaxtı çatıb`
              : "Yeni bildiriş yoxdur"}
          </div>
          <span>{email}</span>
        </header>
        {children}
      </div>
    </div>
  );
}
