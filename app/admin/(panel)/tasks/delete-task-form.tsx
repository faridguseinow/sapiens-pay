"use client";

import { deleteTask } from "./actions";
import { TaskSubmitButton } from "./task-submit-button";

export function DeleteTaskForm({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteTask}
      className="admin-task-delete"
      onSubmit={(event) => {
        if (!window.confirm(`“${title}” tapşırığını arxivləşdirmək istədiyinizə əminsiniz?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <TaskSubmitButton pendingLabel="..." className="admin-task-delete__button">
        Arxivlə
      </TaskSubmitButton>
    </form>
  );
}
