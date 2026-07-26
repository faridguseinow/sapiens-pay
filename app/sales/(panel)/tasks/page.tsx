import { requireRole } from "@/lib/auth/access";
import type { AdminTask, TaskUpdate } from "@/lib/database.types";
import { markTaskSeen, updateTask } from "@/app/admin/(panel)/tasks/actions";

const statusLabels = { todo: "Gözləyir", in_progress: "İş gedir", done: "Hazırdır" };

export default async function SalesTasksPage() {
  const { supabase, member } = await requireRole("sales", "/sales/login");
  const [taskResult, updateResult] = await Promise.all([
    supabase.from("admin_tasks").select("*").eq("assignee_id", member.id).order("deadline"),
    supabase.from("task_updates").select("*").order("created_at", { ascending: false }),
  ]);
  const tasks = (taskResult.data ?? []) as AdminTask[];
  const updates = (updateResult.data ?? []) as TaskUpdate[];

  return (
    <main className="admin-main">
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Şəxsi iş planı</span><h1>Tapşırıqlarım</h1><p>Admin tərəfindən sizə verilən işlər və statusları.</p></div><span className="admin-count">{tasks.filter((task) => task.status !== "done").length} açıq iş</span></div>
      <section className="sales-task-list">
        {tasks.map((task) => <article className="admin-panel sales-task-card" key={task.id}>
          <div className="sales-task-card__main">
            <div><span className={`admin-task-priority admin-task-priority--${task.priority}`}>{task.priority === "high" ? "Yüksək" : task.priority === "low" ? "Aşağı" : "Orta"}</span><span className={`sales-status sales-status--${task.status}`}>{statusLabels[task.status]}</span></div>
            <h2>{task.title}</h2>
            {task.description ? <p>{task.description}</p> : null}
            <small>Son tarix: {new Date(task.deadline).toLocaleString("az-AZ")}</small>
            {!task.seen_at ? <form action={markTaskSeen}><input type="hidden" name="id" value={task.id} /><button className="admin-task-seen">✓ Gördüm</button></form> : <em>Görüldü: {new Date(task.seen_at).toLocaleString("az-AZ")}</em>}
          </div>
          <form action={updateTask} className="sales-task-card__update">
            <input type="hidden" name="id" value={task.id} />
            <label><span>İş barədə qeyd *</span><textarea name="note" rows={3} required placeholder="Görülən işi qısa qeyd edin..." /></label>
            <label><span>Status</span><select name="status" defaultValue={task.status}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <button className="admin-button admin-button--primary">Yenilə</button>
          </form>
          {updates.filter((update) => update.task_id === task.id).length ? <details className="admin-task-history"><summary>Yenilənmə tarixçəsi</summary><div>{updates.filter((update) => update.task_id === task.id).map((update) => <p key={update.id}><strong>{update.author}</strong><span>{update.note}</span><small>{new Date(update.created_at).toLocaleString("az-AZ")}</small></p>)}</div></details> : null}
        </article>)}
        {!tasks.length ? <div className="admin-panel admin-empty">Sizə tapşırıq verilməyib.</div> : null}
      </section>
    </main>
  );
}
