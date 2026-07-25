import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import type { AdminTask, TaskStatus, TaskUpdate, TeamMember } from "@/lib/database.types";
import { addTeamMember, createTask, markTaskSeen, updateTask } from "./actions";

const columns: { status: TaskStatus; title: string; hint: string }[] = [
  { status: "todo", title: "Gözləyir", hint: "Hələ başlanmayıb" },
  { status: "in_progress", title: "İş gedir", hint: "Hazırda icradadır" },
  { status: "done", title: "Hazırdır", hint: "Tamamlanıb" },
];

const statusLabel: Record<TaskStatus, string> = {
  todo: "Gözləyir",
  in_progress: "İş gedir",
  done: "Hazırdır",
};

const priorityLabel = { low: "Aşağı", medium: "Orta", high: "Yüksək" };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Baku",
  }).format(new Date(value));
}

export default async function TasksPage() {
  await connection();
  const supabase = await createClient();
  const [tasksResult, membersResult, updatesResult] = await Promise.all([
    supabase
      .from("admin_tasks")
      .select("*, assignee:team_members(*)")
      .order("deadline", { ascending: true }),
    supabase.from("team_members").select("*").eq("is_active", true).order("name"),
    supabase.from("task_updates").select("*").order("created_at", { ascending: false }),
  ]);

  const setupMissing = tasksResult.error?.code === "42P01";
  const tasks = (tasksResult.data ?? []) as AdminTask[];
  const members = (membersResult.data ?? []) as TeamMember[];
  const updates = (updatesResult.data ?? []) as TaskUpdate[];
  // Request-time value is intentional: overdue state must be current on every page load.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const openCount = tasks.filter((task) => task.status !== "done").length;
  const overdueCount = tasks.filter(
    (task) => task.status !== "done" && new Date(task.deadline).getTime() < now,
  ).length;

  return (
    <main className="admin-main admin-tasks">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Daxili iş bölgüsü</span>
          <h1>Tapşırıqlar</h1>
          <p>Lead-lərdən ayrı, komandanın gündəlik işlərini izləyin.</p>
        </div>
        <div className="admin-task-summary">
          <span><b>{openCount}</b> açıq iş</span>
          <span className={overdueCount ? "is-overdue" : ""}><b>{overdueCount}</b> gecikib</span>
        </div>
      </div>

      {setupMissing ? (
        <div className="admin-setup-notice">
          <strong>Tapşırıq bazası hələ qurulmayıb.</strong>
          <p>Yeni Supabase migration-u tətbiq etdikdən sonra bölmə istifadəyə hazır olacaq.</p>
        </div>
      ) : (
        <>
          <section className="admin-task-tools">
            <form action={createTask} className="admin-panel admin-form admin-task-create">
              <div className="admin-panel__header">
                <div><h2>Yeni tapşırıq</h2><p>Kim, nəyi və nə vaxta qədər etməlidir?</p></div>
              </div>
              <div className="admin-task-create__fields">
                <label>
                  <span>Tapşırıq *</span>
                  <input name="title" required placeholder="Məsələn, ofis üçün kağız alınmalıdır" />
                </label>
                <label>
                  <span>Ətraflı qeyd</span>
                  <textarea name="description" rows={3} placeholder="Lazım olan ölçü, say və digər detallar..." />
                </label>
                <div className="admin-task-create__row">
                  <label>
                    <span>Məsul əməkdaş *</span>
                    <select name="assigneeId" required defaultValue="">
                      <option value="" disabled>Əməkdaş seçin</option>
                      {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Son tarix *</span>
                    <input name="deadline" type="datetime-local" required />
                  </label>
                  <label>
                    <span>Prioritet</span>
                    <select name="priority" defaultValue="medium">
                      <option value="low">Aşağı</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksək</option>
                    </select>
                  </label>
                </div>
                <button className="admin-button admin-button--primary">Tapşırıq yarat</button>
              </div>
            </form>

            <form action={addTeamMember} className="admin-panel admin-form admin-team-add">
              <div className="admin-panel__header">
                <div><h2>Əməkdaş əlavə et</h2><p>Tapşırıq veriləcək şəxslər</p></div>
              </div>
              <div>
                <label><span>Ad, soyad *</span><input name="name" required placeholder="Ad Soyad" /></label>
                <label><span>E-poçt</span><input name="email" type="email" placeholder="email@company.az" /></label>
                <button className="admin-button">+ Siyahıya əlavə et</button>
              </div>
            </form>
          </section>

          <section className="admin-task-board">
            {columns.map((column) => {
              const columnTasks = tasks.filter((task) => task.status === column.status);
              return (
                <div className={`admin-task-column admin-task-column--${column.status}`} key={column.status}>
                  <header>
                    <div><span /><div><h2>{column.title}</h2><p>{column.hint}</p></div></div>
                    <b>{columnTasks.length}</b>
                  </header>
                  <div className="admin-task-column__list">
                    {columnTasks.length ? columnTasks.map((task) => {
                      const taskUpdates = updates.filter((update) => update.task_id === task.id);
                      const overdue = task.status !== "done" && new Date(task.deadline).getTime() < now;
                      return (
                        <article className={`admin-task-card${overdue ? " is-overdue" : ""}`} key={task.id}>
                          <div className="admin-task-card__top">
                            <span className={`admin-task-priority admin-task-priority--${task.priority}`}>
                              {priorityLabel[task.priority]}
                            </span>
                            <span className={overdue ? "admin-task-deadline is-overdue" : "admin-task-deadline"}>
                              {overdue ? "Gecikib · " : ""}{formatDate(task.deadline)}
                            </span>
                          </div>
                          <h3>{task.title}</h3>
                          {task.description ? <p>{task.description}</p> : null}
                          <div className="admin-task-assignee">
                            <b>{task.assignee?.name?.slice(0, 1).toUpperCase() ?? "?"}</b>
                            <div><strong>{task.assignee?.name ?? "Əməkdaş"}</strong><span>{task.seen_at ? `Görüldü · ${formatDate(task.seen_at)}` : "Hələ görməyib"}</span></div>
                          </div>

                          {!task.seen_at ? (
                            <form action={markTaskSeen}>
                              <input type="hidden" name="id" value={task.id} />
                              <button className="admin-task-seen">✓ Gördüm</button>
                            </form>
                          ) : null}

                          {taskUpdates.length ? (
                            <details className="admin-task-history">
                              <summary>{taskUpdates.length} yeniləmə</summary>
                              <div>
                                {taskUpdates.map((update) => (
                                  <p key={update.id}>
                                    <strong>{update.author}</strong>
                                    <span>{update.note}</span>
                                    <small>{update.to_status ? `${statusLabel[update.to_status]} · ` : ""}{formatDate(update.created_at)}</small>
                                  </p>
                                ))}
                              </div>
                            </details>
                          ) : null}

                          <form action={updateTask} className="admin-task-update">
                            <input type="hidden" name="id" value={task.id} />
                            <label>
                              <span>İş barədə qeyd *</span>
                              <textarea name="note" rows={2} required placeholder="Nə edildi və ya hazırda nə edilir?" />
                            </label>
                            <div>
                              <select name="status" defaultValue={task.status}>
                                {columns.map((item) => <option value={item.status} key={item.status}>{item.title}</option>)}
                              </select>
                              <button className="admin-button admin-button--primary">Yenilə</button>
                            </div>
                          </form>
                        </article>
                      );
                    }) : <div className="admin-task-empty">Bu mərhələdə tapşırıq yoxdur.</div>}
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}
