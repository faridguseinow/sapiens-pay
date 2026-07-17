"use client";

import { useEffect, useMemo, useState } from "react";
import { ComposeForm } from "./compose-form";
import { mailLogout } from "./actions";

type Incoming = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  created_at: string;
  attachments: { id: string }[];
};
type Outgoing = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  created_at: string;
  last_event: string;
};
type Detail = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  created_at: string;
  text: string | null;
  html: string | null;
  cc: string[] | null;
  reply_to: string[] | null;
  attachments: Array<{
    id: string;
    filename: string | null;
    size: number;
    download_url: string | null;
  }>;
};
type Folder = "inbox" | "starred" | "sent" | "drafts" | "archive" | "trash";

const icons = {
  inbox: "▣",
  starred: "☆",
  sent: "➤",
  drafts: "▤",
  archive: "▱",
  trash: "⌫",
};
const labels = {
  inbox: "Gələnlər",
  starred: "Ulduzlu",
  sent: "Göndərilənlər",
  drafts: "Qaralamalar",
  archive: "Arxiv",
  trash: "Zibil",
};
const shortDate = (value: string) => {
  const date = new Date(value);
  return `${String(date.getUTCDate()).padStart(2, "0")}.${String(date.getUTCMonth() + 1).padStart(2, "0")}.${date.getUTCFullYear()}`;
};
const fullDate = (value: string) => {
  const date = new Date(value);
  return `${shortDate(value)} ${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")} UTC`;
};

type MailState = {
  message_id: string;
  folder: string;
  is_read: boolean;
  is_starred: boolean;
};
type Draft = {
  id: string;
  recipients: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  updated_at: string;
};
export function MailClient({
  incoming,
  outgoing,
  initialStates,
  initialDrafts,
  accountEmail,
}: {
  incoming: Incoming[];
  outgoing: Outgoing[];
  initialStates: MailState[];
  initialDrafts: Draft[];
  accountEmail: string;
}) {
  const [folder, setFolder] = useState<Folder>("inbox");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(
    incoming[0]?.id ?? null,
  );
  const [detail, setDetail] = useState<Detail | null>(null);
  const [thread, setThread] = useState<Detail[]>([]);
  const [compose, setCompose] = useState(false);
  const [reply, setReply] = useState<{
    id?: string;
    to?: string;
    subject?: string;
    message?: string;
  }>({});
  const [starred, setStarred] = useState<string[]>(
    initialStates.filter((s) => s.is_starred).map((s) => s.message_id),
  );
  const [states, setStates] = useState<MailState[]>(initialStates);
  const [mobileNav, setMobileNav] = useState(false);
  useEffect(() => {
    let saved: string[] = [];
    try {
      saved = JSON.parse(localStorage.getItem("sp-mail-stars") || "[]");
    } catch {}
    const timer = setTimeout(() => setStarred(saved), 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!selected) return;
    let active = true;
    fetch(`/api/mail/${selected}${folder === "sent" ? "?direction=sent" : ""}`)
      .then((r) => r.json())
      .then((v) => {
        if (active) {
          setDetail(v);
          fetch(
            `/api/mail/thread?subject=${encodeURIComponent(v.subject || "")}`,
          )
            .then((r) => r.json())
            .then((items) => {
              if (active && Array.isArray(items)) setThread(items);
            });
        }
      });
    return () => {
      active = false;
    };
  }, [selected, folder]);
  const persist = (messageId: string, patch: Record<string, unknown>) => {
    void fetch("/api/mail/state", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messageId, ...patch }),
    });
  };
  const toggleStar = (id: string) =>
    setStarred((v) => {
      const value = !v.includes(id);
      const next = value ? [...v, id] : v.filter((x) => x !== id);
      localStorage.setItem("sp-mail-stars", JSON.stringify(next));
      persist(id, { isStarred: value });
      setStates((s) => [
        ...s.filter((x) => x.message_id !== id),
        {
          message_id: id,
          folder: s.find((x) => x.message_id === id)?.folder || "inbox",
          is_read: s.find((x) => x.message_id === id)?.is_read || false,
          is_starred: value,
        },
      ]);
      return next;
    });
  const list = useMemo(() => {
    const q = query.toLocaleLowerCase();
    if (folder === "sent")
      return outgoing.filter((m) =>
        `${m.to.join(" ")} ${m.subject}`.toLocaleLowerCase().includes(q),
      );
    let rows = incoming.filter((m) =>
      `${m.from} ${m.subject} ${m.to.join(" ")}`
        .toLocaleLowerCase()
        .includes(q),
    );
    if (folder === "starred") rows = rows.filter((m) => starred.includes(m.id));
    else if (folder !== "drafts")
      rows = rows.filter(
        (m) =>
          (states.find((s) => s.message_id === m.id)?.folder || "inbox") ===
          folder,
      );
    else
      return initialDrafts
        .filter((d) =>
          `${d.recipients.join(" ")} ${d.subject} ${d.body}`
            .toLocaleLowerCase()
            .includes(q),
        )
        .map(
          (d) =>
            ({
              id: d.id,
              from: "Qaralama",
              to: d.recipients,
              subject: d.subject,
              created_at: d.updated_at,
              attachments: [],
            }) satisfies Incoming,
        );
    return rows;
  }, [folder, query, incoming, outgoing, starred, states, initialDrafts]);
  const openComposer = (preset = {}) => {
    setReply(preset);
    setCompose(true);
  };
  return (
    <main className="webmail">
      <aside className={mobileNav ? "is-open" : ""}>
        <div className="webmail-logo">
          <i>sp</i>
          <div>
            <b>Sapiens Mail</b>
            <span>Workspace</span>
          </div>
          <button onClick={() => setMobileNav(false)}>×</button>
        </div>
        <button className="webmail-new" onClick={() => openComposer()}>
          ＋ <span>Yeni məktub</span>
        </button>
        <nav>
          {(Object.keys(labels) as Folder[]).map((key) => (
            <button
              key={key}
              className={folder === key ? "active" : ""}
              onClick={() => {
                setFolder(key);
                setSelected(key === "inbox" ? (incoming[0]?.id ?? null) : null);
                setDetail(null);
                setMobileNav(false);
              }}
            >
              <i>{icons[key]}</i>
              <span>{labels[key]}</span>
              {key === "inbox" && incoming.length ? (
                <em>{incoming.length}</em>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="webmail-storage">
          <span>
            <b>Yaddaş</b>
            <small>Resend Cloud</small>
          </span>
          <div>
            <i />
          </div>
        </div>
        <form action={mailLogout}>
          <button className="webmail-user">
            <i>{accountEmail[0]?.toUpperCase()}</i>
            <span>
              <b>{accountEmail.split("@")[0]}</b>
              <small>{accountEmail}</small>
            </span>
            <em>↪</em>
          </button>
        </form>
      </aside>
      <section className="webmail-main">
        <header>
          <button className="webmail-menu" onClick={() => setMobileNav(true)}>
            ☰
          </button>
          <label>
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Məktublarda axtar"
            />
            <kbd>⌘ K</kbd>
          </label>
          <button title="Yenilə" onClick={() => location.reload()}>
            ↻
          </button>
          <button title="Kömək">?</button>
          <div className="webmail-avatar">{accountEmail[0]?.toUpperCase()}</div>
        </header>
        <div className="webmail-toolbar">
          <div>
            <h1>{labels[folder]}</h1>
            <span>{list.length} məktub</span>
          </div>
          <div>
            <button title="Hamısını seç">□</button>
            <button title="Yenilə" onClick={() => location.reload()}>
              ↻
            </button>
            <button title="Daha çox">•••</button>
          </div>
        </div>
        <div className="webmail-content">
          <section className="webmail-list">
            {list.length ? (
              list.map((m: Incoming | Outgoing) => (
                <article
                  key={m.id}
                  className={`${selected === m.id ? "active" : ""} ${!states.find((item) => item.message_id === m.id)?.is_read && folder !== "sent" ? "unread" : ""}`}
                  onClick={() => {
                    if (folder === "drafts") {
                      const draft = initialDrafts.find(
                        (item) => item.id === m.id,
                      );
                      if (draft)
                        openComposer({
                          id: draft.id,
                          to: draft.recipients[0] || "",
                          subject: draft.subject,
                          message: draft.body,
                        });
                      return;
                    }
                    setSelected(m.id);
                    setDetail(null);
                    persist(m.id, { isRead: true });
                    setStates((items) => [
                      ...items.filter((item) => item.message_id !== m.id),
                      {
                        message_id: m.id,
                        folder:
                          items.find((item) => item.message_id === m.id)
                            ?.folder || "inbox",
                        is_read: true,
                        is_starred: starred.includes(m.id),
                      },
                    ]);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(m.id);
                    }}
                  >
                    {starred.includes(m.id) ? "★" : "☆"}
                  </button>
                  <div className="webmail-sender">
                    {(folder === "sent" ? m.to[0] : m.from)
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div>
                      <b>{folder === "sent" ? m.to.join(", ") : m.from}</b>
                      <time>{shortDate(m.created_at)}</time>
                    </div>
                    <h3>{m.subject || "Mövzusuz"}</h3>
                    <p>
                      {folder === "sent"
                        ? `Status: ${(m as Outgoing).last_event}`
                        : `${m.to.join(", ")}${"attachments" in m && m.attachments?.length ? " · Əlavə fayl" : ""}`}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="webmail-none">
                <i>✓</i>
                <h2>Burada məktub yoxdur</h2>
                <p>
                  {query
                    ? "Axtarışa uyğun nəticə tapılmadı."
                    : "Bu qovluq hazırda boşdur."}
                </p>
              </div>
            )}
          </section>
          <section className="webmail-reader">
            {selected ? (
              <>
                {detail ? (
                  <>
                    <div className="reader-head">
                      <div>
                        <small>{detail.to.join(", ")}</small>
                        <h2>{detail.subject || "Mövzusuz"}</h2>
                      </div>
                      <div>
                        <button
                          title="Arxivlə"
                          onClick={() => {
                            persist(detail.id, { folder: "archive" });
                            setStates((items) => [
                              ...items.filter(
                                (item) => item.message_id !== detail.id,
                              ),
                              {
                                message_id: detail.id,
                                folder: "archive",
                                is_read: true,
                                is_starred: starred.includes(detail.id),
                              },
                            ]);
                            setSelected(null);
                          }}
                        >
                          ▱
                        </button>
                        <button
                          title="Zibilə at"
                          onClick={() => {
                            persist(detail.id, { folder: "trash" });
                            setStates((items) => [
                              ...items.filter(
                                (item) => item.message_id !== detail.id,
                              ),
                              {
                                message_id: detail.id,
                                folder: "trash",
                                is_read: true,
                                is_starred: starred.includes(detail.id),
                              },
                            ]);
                            setSelected(null);
                          }}
                        >
                          ⌫
                        </button>
                        <button onClick={() => toggleStar(detail.id)}>
                          {starred.includes(detail.id) ? "★" : "☆"}
                        </button>
                      </div>
                    </div>
                    <div className="reader-from">
                      <i>{detail.from[0]?.toUpperCase()}</i>
                      <div>
                        <b>{detail.from}</b>
                        <span>kimə: {detail.to.join(", ")}</span>
                      </div>
                      <time>{fullDate(detail.created_at)}</time>
                    </div>
                    <div className="reader-body">
                      {thread.length > 1 ? (
                        <div className="reader-thread">
                          <b>{thread.length} məktubluq yazışma</b>
                          {thread.slice(0, -1).map((item) => (
                            <details key={item.id}>
                              <summary>
                                {item.from} · {shortDate(item.created_at)}
                              </summary>
                              <p>{item.text || "HTML məktub"}</p>
                            </details>
                          ))}
                        </div>
                      ) : null}
                      {detail.text ? (
                        <p>{detail.text}</p>
                      ) : (
                        <p className="reader-muted">
                          Bu məktubun mətn versiyası yoxdur.
                        </p>
                      )}
                    </div>
                    {detail.attachments.length ? (
                      <div className="reader-files">
                        {detail.attachments.map((f) => (
                          <a
                            key={f.id}
                            href={f.download_url || "#"}
                            target="_blank"
                          >
                            <i>▧</i>
                            <span>
                              <b>{f.filename || "Fayl"}</b>
                              <small>{Math.ceil(f.size / 1024)} KB</small>
                            </span>
                            ↓
                          </a>
                        ))}
                      </div>
                    ) : null}
                    <div className="reader-actions">
                      <button
                        onClick={() =>
                          openComposer({
                            to:
                              detail.reply_to?.[0] ||
                              detail.from.replace(/^.*<|>.*$/g, ""),
                            subject: `Re: ${detail.subject}`,
                          })
                        }
                      >
                        ↩ Cavabla
                      </button>
                      <button
                        onClick={() =>
                          openComposer({
                            subject: `Fwd: ${detail.subject}`,
                            message: detail.text || "",
                          })
                        }
                      >
                        ➦ Yönləndir
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="reader-loading">Məktub açılır...</div>
                )}
              </>
            ) : (
              <div className="reader-placeholder">
                <i>✉</i>
                <h2>Məktub seçin</h2>
                <p>Oxumaq üçün soldakı siyahıdan bir məktub seçin.</p>
              </div>
            )}
          </section>
        </div>
      </section>
      {compose ? (
        <div className="compose-modal">
          <div className="compose-window">
            <button className="compose-close" onClick={() => setCompose(false)}>
              ×
            </button>
            <ComposeForm initial={reply} onSent={() => setCompose(false)} />
          </div>
        </div>
      ) : null}
    </main>
  );
}
