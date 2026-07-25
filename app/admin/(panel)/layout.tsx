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
  const userId = typeof data.claims.sub === "string" ? data.claims.sub : "";
  const [{ data: notificationData }, { data: currentMember }] = await Promise.all([
    supabase.from("leads").select("id,status,next_follow_up_at,profile"),
    userId
      ? supabase.from("team_members").select("id").eq("auth_user_id", userId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
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
  const { count: unseenTaskCount } = currentMember?.id
    ? await supabase
        .from("admin_tasks")
        .select("id", { count: "exact", head: true })
        .eq("assignee_id", currentMember.id)
        .neq("status", "done")
        .is("seen_at", null)
    : { count: 0 };

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
          <Link href="/admin/tasks">
            <span>✓</span>
            Tapşırıqlar
            {unseenTaskCount ? <b className="admin-nav__badge">{unseenTaskCount}</b> : null}
          </Link>
          <Link href="/admin/blog">
            <span>✦</span>
            Bloq
          </Link>
          <Link href="/admin/mail">
            <span>✉</span>
            Mail ünvanları
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
