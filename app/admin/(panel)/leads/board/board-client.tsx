"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Lead, LeadStatus } from "@/lib/database.types";
import { updateLeadPriority, updateLeadStatus } from "../../../actions";

const columns: Array<{ status: LeadStatus; label: string }> = [
  { status: "new", label: "Yeni" },
  { status: "contacted", label: "Əlaqə saxlanıldı" },
  { status: "qualified", label: "Maraqlanır" },
  { status: "won", label: "Müştəri oldu" },
  { status: "closed", label: "Uyğun deyil" },
];

const priorityLabels = {
  high: "Yüksək",
  medium: "Orta",
  low: "Aşağı",
} as const;

function formatFollowUp(value: string) {
  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Baku",
  }).format(new Date(value));
}

export function LeadsBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const changeStatus = (id: string, status: LeadStatus) => {
    const previous = leads;
    setError("");
    setLeads((items) => items.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    startTransition(async () => {
      const result = await updateLeadStatus(id, status);
      if (result.error) {
        setLeads(previous);
        setError(result.error);
      }
    });
  };

  const changePriority = (id: string, priority: "high" | "medium" | "low") => {
    const previous = leads;
    setError("");
    setLeads((items) =>
      items.map((lead) =>
        lead.id === id
          ? { ...lead, profile: { ...lead.profile, priority } }
          : lead,
      ),
    );
    startTransition(async () => {
      const result = await updateLeadPriority(id, priority);
      if (result.error) {
        setLeads(previous);
        setError(result.error);
      }
    });
  };

  return (
    <>
      {error ? <p className="admin-board-error" role="alert">{error}</p> : null}
      <div className={`admin-kanban${isPending ? " admin-kanban--saving" : ""}`}>
        {columns.map((column) => {
          const columnLeads = leads.filter((lead) => lead.status === column.status);
          return (
            <section
              className={`admin-kanban__column admin-kanban__column--${column.status}`}
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedId) changeStatus(draggedId, column.status);
                setDraggedId(null);
              }}
            >
              <header>
                <h2>{column.label}</h2>
                <span>{columnLeads.length}</span>
              </header>
              <div className="admin-kanban__cards">
                {columnLeads.map((lead) => {
                  const priority = lead.profile?.priority ?? "medium";
                  const isOverdue =
                    Boolean(lead.next_follow_up_at) &&
                    new Date(lead.next_follow_up_at!).getTime() < Date.now() &&
                    !["won", "closed"].includes(lead.status);
                  return (
                    <article
                      className={`admin-kanban-card admin-kanban-card--${priority}`}
                      draggable
                      key={lead.id}
                      onDragStart={(event) => {
                        setDraggedId(lead.id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => setDraggedId(null)}
                    >
                      <div className="admin-kanban-card__top">
                        <span className={`admin-priority admin-priority--${priority}`}>
                          {priorityLabels[priority]}
                        </span>
                        <small>{lead.locale.toUpperCase()}</small>
                      </div>
                      <Link href={`/admin/leads/${lead.id}`} className="admin-kanban-card__name">
                        {lead.name}
                      </Link>
                      <p>{lead.service_name || lead.profile?.service || "Ümumi müraciət"}</p>
                      <strong>{lead.package_name || lead.profile?.package || "Paket seçilməyib"}</strong>
                      {lead.next_follow_up_at ? (
                        <div className={`admin-follow-up${isOverdue ? " admin-follow-up--overdue" : ""}`}>
                          {isOverdue ? "Gecikib" : "Növbəti əlaqə"} · {formatFollowUp(lead.next_follow_up_at)}
                        </div>
                      ) : null}
                      <div className="admin-kanban-card__controls">
                        <label>
                          <span>Mərhələ</span>
                          <select
                            value={lead.status}
                            onChange={(event) => changeStatus(lead.id, event.target.value as LeadStatus)}
                          >
                            {columns.map((item) => <option value={item.status} key={item.status}>{item.label}</option>)}
                          </select>
                        </label>
                        <label>
                          <span>Prioritet</span>
                          <select
                            value={priority}
                            onChange={(event) => changePriority(lead.id, event.target.value as "high" | "medium" | "low")}
                          >
                            <option value="high">Yüksək</option>
                            <option value="medium">Orta</option>
                            <option value="low">Aşağı</option>
                          </select>
                        </label>
                      </div>
                    </article>
                  );
                })}
                {!columnLeads.length ? <div className="admin-kanban__empty">Müraciət yoxdur</div> : null}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
