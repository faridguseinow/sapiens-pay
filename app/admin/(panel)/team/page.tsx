import { requireRole } from "@/lib/auth/access";
import { isMailAdminOwner } from "@/lib/mail/admin-access";
import type { TeamMember } from "@/lib/database.types";
import { updateStaffRole } from "./actions";

export default async function TeamPage() {
  const { supabase, claims } = await requireRole("admin", "/admin/login");
  const { data, error } = await supabase.from("team_members").select("*").not("auth_user_id", "is", null).order("name");
  if (error) throw new Error(error.message);
  const members = (data ?? []) as TeamMember[];
  const canManage = isMailAdminOwner(claims.email);

  return (
    <main className="admin-main">
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Giriş və icazələr</span><h1>Komanda və rollar</h1><p>Auth hesablarını admin və satış iş sahələrinə ayırın.</p></div><span className="admin-count">{members.length} aktiv hesab</span></div>
      {!canManage ? <div className="admin-setup-notice"><strong>Yalnız baxış rejimi</strong><p>Rolları yalnız sistem sahibi dəyişə bilər.</p></div> : null}
      <section className="admin-panel">
        <div className="admin-panel__header"><div><h2>Panel istifadəçiləri</h2><p>Yeni Auth hesabları avtomatik satış rolunda yaranır</p></div></div>
        <div className="team-role-list">{members.map((member) => <article key={member.id}>
          <div className="admin-person"><b>{member.name.slice(0, 1).toUpperCase()}</b><span><strong>{member.name}</strong><small>{member.email}</small></span></div>
          <span className={`team-role team-role--${member.role}`}>{member.role === "admin" ? "Admin" : "Satış təmsilçisi"}</span>
          {canManage ? <form action={updateStaffRole}>
            <input type="hidden" name="id" value={member.id} />
            <select name="role" defaultValue={member.role}><option value="admin">Admin</option><option value="sales">Satış təmsilçisi</option></select>
            <button className="admin-button">Rolu yadda saxla</button>
          </form> : null}
        </article>)}</div>
      </section>
    </main>
  );
}
