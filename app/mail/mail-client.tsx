"use client";

import {
  Archive,
  ArrowLeft,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  FileText,
  Filter,
  Forward,
  Inbox,
  LayoutPanelLeft,
  ListFilter,
  LogOut,
  Mail,
  MailOpen,
  Menu,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Printer,
  RefreshCw,
  Reply,
  ReplyAll,
  Search,
  Send,
  Settings2,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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
type Folder =
  "inbox" | "starred" | "sent" | "drafts" | "archive" | "spam" | "trash";
type FilterMode = "all" | "unread" | "starred" | "attachments";
type Density = "comfortable" | "compact";
type MailPreferences = {
  displayName: string;
  signature: string;
  notifications: boolean;
  avatar: string;
  templates: Array<{ id: string; name: string; body: string }>;
};

const folderMeta = {
  inbox: { label: "Gələnlər", Icon: Inbox },
  starred: { label: "Ulduzlu", Icon: Star },
  sent: { label: "Göndərilənlər", Icon: Send },
  drafts: { label: "Qaralamalar", Icon: FileText },
  archive: { label: "Arxiv", Icon: Archive },
  spam: { label: "Spam", Icon: CircleAlert },
  trash: { label: "Zibil", Icon: Trash2 },
} satisfies Record<Folder, { label: string; Icon: typeof Inbox }>;

const filterMeta = {
  all: "Hamısı",
  unread: "Oxunmamış",
  starred: "Ulduzlu",
  attachments: "Əlavəli",
} satisfies Record<FilterMode, string>;

const stripAddress = (value: string) =>
  value.match(/<([^>]+)>/)?.[1] || value.trim();
const displayName = (value: string) =>
  value.replace(/\s*<[^>]+>\s*$/, "").replace(/^['\"]|['\"]$/g, "") || value;
const initials = (value: string) =>
  displayName(value)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
const azMonths = [
  "yan",
  "fev",
  "mar",
  "apr",
  "may",
  "iyn",
  "iyl",
  "avq",
  "sen",
  "okt",
  "noy",
  "dek",
];
const azMonthsLong = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avqust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];
const twoDigits = (value: number) => String(value).padStart(2, "0");
const shortDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${twoDigits(date.getUTCDate())} ${azMonths[date.getUTCMonth()]}`;
};
const fullDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${twoDigits(date.getUTCDate())} ${azMonthsLong[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${twoDigits(date.getUTCHours())}:${twoDigits(date.getUTCMinutes())} UTC`;
};
const statusLabel = (status: string) =>
  ({
    delivered: "Çatdırıldı",
    sent: "Göndərildi",
    queued: "Növbədədir",
    bounced: "Geri qaytarıldı",
    complained: "Şikayət edildi",
    opened: "Açıldı",
    clicked: "Keçid açıldı",
  })[status] || status;

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
type ComposePreset = {
  id?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  message?: string;
};

function IconButton({
  label,
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`mail-icon-button${active ? " is-active" : ""}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <span className="mail-tooltip" role="tooltip">
        {label}
      </span>
    </button>
  );
}

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
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [thread, setThread] = useState<Detail[]>([]);
  const [compose, setCompose] = useState(false);
  const [composeMinimized, setComposeMinimized] = useState(false);
  const [reply, setReply] = useState<ComposePreset>({});
  const [states, setStates] = useState<MailState[]>(initialStates);
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [mobileNav, setMobileNav] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [density, setDensity] = useState<Density>("comfortable");
  const [toast, setToast] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState<MailPreferences>({
    displayName: "Sapiens Pay",
    signature: "",
    notifications: false,
    avatar: "",
    templates: [],
  });
  const searchRef = useRef<HTMLInputElement>(null);

  const contacts = useMemo(() => {
    const values = [
      ...incoming.flatMap((item) => [item.from, ...item.to]),
      ...outgoing.flatMap((item) => [item.from, ...item.to]),
    ];
    return [...new Set(values.map(stripAddress).filter((item) => item && item !== accountEmail))]
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 250);
  }, [accountEmail, incoming, outgoing]);

  const stateFor = useCallback(
    (id: string) => states.find((item) => item.message_id === id),
    [states],
  );
  const starred = useMemo(
    () =>
      states
        .filter((state) => state.is_starred)
        .map((state) => state.message_id),
    [states],
  );
  const unreadCount = useMemo(
    () =>
      incoming.filter((mail) => !(stateFor(mail.id)?.is_read ?? false)).length,
    [incoming, stateFor],
  );

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }, []);
  const persist = useCallback(
    async (messageId: string, patch: Record<string, unknown>) => {
      const response = await fetch("/api/mail/state", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messageId, ...patch }),
      });
      if (!response.ok) notify("Dəyişiklik saxlanılmadı. Yenidən cəhd edin.");
    },
    [notify],
  );

  const patchStates = useCallback(
    (
      ids: string[],
      patch: Partial<Pick<MailState, "folder" | "is_read" | "is_starred">>,
    ) => {
      setStates((items) => {
        const map = new Map(items.map((item) => [item.message_id, item]));
        ids.forEach((id) => {
          const current = map.get(id);
          map.set(id, {
            message_id: id,
            folder: patch.folder ?? current?.folder ?? "inbox",
            is_read: patch.is_read ?? current?.is_read ?? false,
            is_starred: patch.is_starred ?? current?.is_starred ?? false,
          });
        });
        return [...map.values()];
      });
    },
    [],
  );

  useEffect(() => {
    let saved: string[] = [];
    try {
      saved = JSON.parse(localStorage.getItem("sp-mail-stars") || "[]");
    } catch {}
    const missing = saved.filter(
      (id) => !initialStates.some((state) => state.message_id === id),
    );
    const savedDensity = localStorage.getItem("sp-mail-density");
    const savedPreferences = localStorage.getItem(`sp-mail-preferences:${accountEmail}`);
    const timer = window.setTimeout(() => {
      if (missing.length) patchStates(missing, { is_starred: true });
      if (savedDensity === "compact") setDensity("compact");
      if (savedPreferences) {
        try {
          setPreferences((current) => ({ ...current, ...JSON.parse(savedPreferences) }));
        } catch {}
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [accountEmail, initialStates, patchStates]);

  useEffect(() => {
    if (!preferences.notifications || !unreadCount || !("Notification" in window)) return;
    if (Notification.permission === "granted" && document.visibilityState === "hidden") {
      new Notification("Sapiens Mail", {
        body: `${unreadCount} oxunmamış məktubunuz var.`,
        icon: "/favicon.ico",
      });
    }
  }, [preferences.notifications, unreadCount]);

  const savePreferences = async (next: MailPreferences) => {
    if (next.notifications && "Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      next = { ...next, notifications: permission === "granted" };
    }
    setPreferences(next);
    localStorage.setItem(`sp-mail-preferences:${accountEmail}`, JSON.stringify(next));
    setSettingsOpen(false);
    notify("Poçt parametrləri saxlanıldı");
  };

  const toggleStar = useCallback(
    (id: string) => {
      const value = !(stateFor(id)?.is_starred ?? false);
      patchStates([id], { is_starred: value });
      void persist(id, { isStarred: value });
      const next = value
        ? [...new Set([...starred, id])]
        : starred.filter((item) => item !== id);
      localStorage.setItem("sp-mail-stars", JSON.stringify(next));
      notify(value ? "Ulduzluya əlavə edildi" : "Ulduz silindi");
    },
    [notify, patchStates, persist, starred, stateFor],
  );

  const markRead = useCallback(
    (ids: string[], value: boolean) => {
      patchStates(ids, { is_read: value });
      ids.forEach((id) => void persist(id, { isRead: value }));
      notify(value ? "Oxunmuş kimi işarələndi" : "Oxunmamış kimi işarələndi");
    },
    [notify, patchStates, persist],
  );

  const moveMessages = useCallback(
    (ids: string[], destination: "inbox" | "archive" | "trash" | "spam") => {
      patchStates(ids, { folder: destination });
      ids.forEach((id) => void persist(id, { folder: destination }));
      setChecked([]);
      if (selected && ids.includes(selected)) {
        setSelected(null);
        setDetail(null);
      }
      notify(
        destination === "inbox"
          ? "Gələnlərə qaytarıldı"
          : destination === "archive"
            ? "Arxivləndi"
            : destination === "spam"
              ? "Spam kimi işarələndi"
              : "Zibilə köçürüldü",
      );
    },
    [notify, patchStates, persist, selected],
  );

  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("az");
    if (folder === "drafts")
      return drafts
        .filter((draft) =>
          `${draft.recipients.join(" ")} ${draft.subject} ${draft.body}`
            .toLocaleLowerCase("az")
            .includes(q),
        )
        .map(
          (draft) =>
            ({
              id: draft.id,
              from: "Qaralama",
              to: draft.recipients,
              subject: draft.subject,
              created_at: draft.updated_at,
              attachments: [],
            }) satisfies Incoming,
        );
    if (folder === "sent")
      return outgoing.filter(
        (mail) =>
          (stateFor(mail.id)?.folder || "sent") !== "trash" &&
          `${mail.to.join(" ")} ${mail.subject}`
            .toLocaleLowerCase("az")
            .includes(q),
      );
    let rows = incoming.filter((mail) =>
      `${mail.from} ${mail.subject} ${mail.to.join(" ")}`
        .toLocaleLowerCase("az")
        .includes(q),
    );
    if (folder === "starred")
      rows = rows.filter((mail) => starred.includes(mail.id));
    else
      rows = rows.filter(
        (mail) => (stateFor(mail.id)?.folder || "inbox") === folder,
      );
    if (filter === "unread")
      rows = rows.filter((mail) => !stateFor(mail.id)?.is_read);
    if (filter === "starred")
      rows = rows.filter((mail) => starred.includes(mail.id));
    if (filter === "attachments")
      rows = rows.filter((mail) => mail.attachments.length > 0);
    return rows;
  }, [drafts, filter, folder, incoming, outgoing, query, starred, stateFor]);

  const selectedIndex = list.findIndex((item) => item.id === selected);
  const allSelected = list.length > 0 && checked.length === list.length;

  const openMessage = useCallback(
    (id: string) => {
      if (folder === "drafts") {
        const draft = drafts.find((item) => item.id === id);
        if (draft) {
          setReply({
            id: draft.id,
            to: draft.recipients.join(", "),
            cc: draft.cc.join(", "),
            bcc: draft.bcc.join(", "),
            subject: draft.subject,
            message: draft.body,
          });
          setCompose(true);
          setComposeMinimized(false);
        }
        return;
      }
      setSelected(id);
      setDetail(null);
      setLoadingDetail(true);
      if (folder !== "sent") markRead([id], true);
    },
    [drafts, folder, markRead],
  );

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    fetch(
      `/api/mail/${selected}${folder === "sent" ? "?direction=sent" : ""}`,
      {
        signal: controller.signal,
      },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("message");
        return response.json();
      })
      .then((value: Detail) => {
        setDetail(value);
        return fetch(
          `/api/mail/thread?subject=${encodeURIComponent(value.subject || "")}`,
          {
            signal: controller.signal,
          },
        );
      })
      .then((response) => response.json())
      .then((items) => Array.isArray(items) && setThread(items))
      .catch((error) => {
        if (error.name !== "AbortError") notify("Məktub açıla bilmədi");
      })
      .finally(() => setLoadingDetail(false));
    return () => controller.abort();
  }, [folder, notify, selected]);

  const openComposer = useCallback((preset: ComposePreset = {}) => {
    setReply(preset);
    setCompose(true);
    setComposeMinimized(false);
  }, []);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.matches(
        "input, textarea, [contenteditable='true']",
      );
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (!typing && event.key.toLowerCase() === "c") openComposer();
      if (!typing && event.key.toLowerCase() === "r" && detail)
        openComposer({
          to: detail.reply_to?.[0] || stripAddress(detail.from),
          subject: `Re: ${detail.subject}`,
        });
      if (event.key === "Escape") {
        setMobileNav(false);
        setFilterOpen(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [detail, openComposer]);

  const deleteDraft = async (id: string) => {
    const response = await fetch(`/api/mail/drafts?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setDrafts((items) => items.filter((item) => item.id !== id));
      notify("Qaralama silindi");
    } else notify("Qaralama silinə bilmədi");
  };

  const selectFolder = (next: Folder) => {
    setFolder(next);
    setSelected(null);
    setDetail(null);
    setThread([]);
    setChecked([]);
    setFilter("all");
    setMobileNav(false);
  };

  return (
    <main
      translate="no"
      className={`webmail density-${density}${selected ? " has-open-message" : ""}`}
    >
      {mobileNav ? (
        <button
          className="mail-nav-backdrop"
          onClick={() => setMobileNav(false)}
          aria-label="Menyunu bağla"
        />
      ) : null}
      <aside
        className={mobileNav ? "is-open" : ""}
        aria-label="Mail qovluqları"
      >
        <div className="webmail-logo">
          <i>
            <Sparkles size={18} />
          </i>
          <div>
            <b>Sapiens Mail</b>
            <span>Business workspace</span>
          </div>
          <IconButton label="Menyunu bağla" onClick={() => setMobileNav(false)}>
            <X size={20} />
          </IconButton>
        </div>
        <button className="webmail-new" onClick={() => openComposer()}>
          <Pencil size={19} />
          <span>Yeni məktub</span>
        </button>
        <nav>
          {(Object.keys(folderMeta) as Folder[]).map((key) => {
            const { Icon, label } = folderMeta[key];
            const count =
              key === "inbox"
                ? unreadCount
                : key === "drafts"
                  ? drafts.length
                  : 0;
            return (
              <button
                key={key}
                className={folder === key ? "active" : ""}
                onClick={() => selectFolder(key)}
                aria-current={folder === key ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={1.9} />
                <span>{label}</span>
                {count ? <em>{count}</em> : null}
              </button>
            );
          })}
        </nav>
        <div className="mail-shortcuts">
          <span>QISA YOLLAR</span>
          <p>
            <kbd>C</kbd> Yeni məktub
          </p>
          <p>
            <kbd>R</kbd> Cavabla
          </p>
          <p>
            <kbd>⌘K</kbd> Axtar
          </p>
        </div>
        <form action={mailLogout}>
          <button className="webmail-user">
            <i>{preferences.avatar ? <Image src={preferences.avatar} alt="Profil" width={160} height={160} unoptimized /> : accountEmail[0]?.toUpperCase()}</i>
            <span>
              <b>{accountEmail.split("@")[0]}</b>
              <small>{accountEmail}</small>
            </span>
            <LogOut size={17} />
          </button>
        </form>
      </aside>

      <section className="webmail-main">
        <header className="mail-topbar">
          <IconButton label="Menyunu aç" onClick={() => setMobileNav(true)}>
            <Menu size={20} />
          </IconButton>
          <label className="mail-search">
            <Search size={19} />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Məktub, göndərən və ya mövzu axtar..."
              aria-label="Məktublarda axtar"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Axtarışı təmizlə"
              >
                <X size={17} />
              </button>
            ) : (
              <kbd>⌘ K</kbd>
            )}
          </label>
          <IconButton label="Yenilə" onClick={() => location.reload()}>
            <RefreshCw size={18} />
          </IconButton>
          <IconButton label="Poçt parametrləri" onClick={() => setSettingsOpen(true)}>
            <Settings2 size={18} />
          </IconButton>
          <div className="webmail-avatar" title={accountEmail}>
            {preferences.avatar ? <Image src={preferences.avatar} alt="Profil" width={160} height={160} unoptimized /> : accountEmail[0]?.toUpperCase()}
          </div>
        </header>

        <div className="webmail-toolbar">
          <div className="mail-title">
            <h1>{folderMeta[folder].label}</h1>
            <span>
              {list.length} məktub
              {unreadCount && folder === "inbox"
                ? ` · ${unreadCount} oxunmamış`
                : ""}
            </span>
          </div>
          <div className="mail-toolbar-actions">
            <div className="mail-select-control">
              <IconButton
                label={allSelected ? "Seçimi ləğv et" : "Hamısını seç"}
                active={allSelected}
                onClick={() =>
                  setChecked(allSelected ? [] : list.map((item) => item.id))
                }
              >
                <span
                  className={`mail-checkbox${allSelected ? " checked" : ""}`}
                >
                  {allSelected ? <Check size={13} /> : null}
                </span>
              </IconButton>
              <button
                className="mail-select-arrow"
                onClick={() => setFilterOpen((value) => !value)}
                aria-label="Seçim və filtr menyusu"
              >
                <ChevronDown size={14} />
              </button>
            </div>
            {checked.length ? (
              <>
                <span className="mail-selection-count">
                  {checked.length} seçilib
                </span>
                <IconButton
                  label="Oxunmuş et"
                  onClick={() => markRead(checked, true)}
                >
                  <MailOpen size={18} />
                </IconButton>
                <IconButton
                  label="Oxunmamış et"
                  onClick={() => markRead(checked, false)}
                >
                  <Mail size={18} />
                </IconButton>
                <IconButton
                  label="Arxivlə"
                  onClick={() => moveMessages(checked, "archive")}
                >
                  <Archive size={18} />
                </IconButton>
                <IconButton
                  label="Spam kimi işarələ"
                  onClick={() => moveMessages(checked, "spam")}
                >
                  <CircleAlert size={18} />
                </IconButton>
                <IconButton
                  label="Zibilə köçür"
                  onClick={() => moveMessages(checked, "trash")}
                >
                  <Trash2 size={18} />
                </IconButton>
              </>
            ) : (
              <>
                <div className="mail-popover-wrap">
                  <IconButton
                    label="Filtrlər"
                    active={filter !== "all"}
                    onClick={() => setFilterOpen((value) => !value)}
                  >
                    <ListFilter size={18} />
                  </IconButton>
                  {filterOpen ? (
                    <div className="mail-popover" role="menu">
                      <strong>Məktubları göstər</strong>
                      {(Object.keys(filterMeta) as FilterMode[]).map((key) => (
                        <button
                          key={key}
                          className={filter === key ? "active" : ""}
                          onClick={() => {
                            setFilter(key);
                            setFilterOpen(false);
                          }}
                        >
                          <span>{filterMeta[key]}</span>
                          {filter === key ? <Check size={15} /> : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <IconButton label="Yenilə" onClick={() => location.reload()}>
                  <RefreshCw size={18} />
                </IconButton>
                <div className="mail-popover-wrap">
                  <IconButton
                    label="Görünüş seçimləri"
                    onClick={() => setMoreOpen((value) => !value)}
                  >
                    <Settings2 size={18} />
                  </IconButton>
                  {moreOpen ? (
                    <div className="mail-popover mail-view-popover">
                      <strong>Siyahı sıxlığı</strong>
                      <button
                        className={density === "comfortable" ? "active" : ""}
                        onClick={() => {
                          setDensity("comfortable");
                          localStorage.setItem(
                            "sp-mail-density",
                            "comfortable",
                          );
                          setMoreOpen(false);
                        }}
                      >
                        <LayoutPanelLeft size={16} />
                        <span>Rahat</span>
                        {density === "comfortable" ? <Check size={15} /> : null}
                      </button>
                      <button
                        className={density === "compact" ? "active" : ""}
                        onClick={() => {
                          setDensity("compact");
                          localStorage.setItem("sp-mail-density", "compact");
                          setMoreOpen(false);
                        }}
                      >
                        <Filter size={16} />
                        <span>Kompakt</span>
                        {density === "compact" ? <Check size={15} /> : null}
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="webmail-content">
          <section
            className="webmail-list"
            aria-label={`${folderMeta[folder].label} məktubları`}
          >
            {list.length ? (
              list.map((mailItem: Incoming | Outgoing) => {
                const isDraft = folder === "drafts";
                const isSent = folder === "sent";
                const isUnread =
                  !isSent &&
                  !isDraft &&
                  !(stateFor(mailItem.id)?.is_read ?? false);
                const sender = isSent ? mailItem.to.join(", ") : mailItem.from;
                return (
                  <article
                    key={mailItem.id}
                    className={`${selected === mailItem.id ? "active" : ""}${isUnread ? " unread" : ""}`}
                    onClick={() => openMessage(mailItem.id)}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") openMessage(mailItem.id);
                    }}
                    aria-label={`${sender}: ${mailItem.subject || "Mövzusuz"}`}
                  >
                    {!isDraft ? (
                      <label
                        className="mail-row-check"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={checked.includes(mailItem.id)}
                          onChange={() =>
                            setChecked((items) =>
                              items.includes(mailItem.id)
                                ? items.filter((id) => id !== mailItem.id)
                                : [...items, mailItem.id],
                            )
                          }
                          aria-label="Məktubu seç"
                        />
                        <span>
                          {checked.includes(mailItem.id) ? (
                            <Check size={12} />
                          ) : null}
                        </span>
                      </label>
                    ) : (
                      <span />
                    )}
                    <button
                      className={`mail-row-star${starred.includes(mailItem.id) ? " active" : ""}`}
                      aria-label={
                        isDraft
                          ? "Qaralamanı sil"
                          : starred.includes(mailItem.id)
                            ? "Ulduzu sil"
                            : "Ulduzla"
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        if (isDraft) void deleteDraft(mailItem.id);
                        else toggleStar(mailItem.id);
                      }}
                    >
                      {isDraft ? (
                        <Trash2 size={17} />
                      ) : (
                        <Star
                          size={18}
                          fill={
                            starred.includes(mailItem.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )}
                    </button>
                    <div className="webmail-sender">{initials(sender)}</div>
                    <div className="mail-row-copy">
                      <div className="mail-row-meta">
                        <b>
                          {isDraft
                            ? mailItem.to.join(", ") || "Alıcı yoxdur"
                            : displayName(sender)}
                        </b>
                        <time translate="no" suppressHydrationWarning>
                          {shortDate(mailItem.created_at)}
                        </time>
                      </div>
                      <h3>{mailItem.subject || "Mövzusuz"}</h3>
                      <p>
                        {isDraft ? (
                          "Qaralama"
                        ) : isSent ? (
                          <>
                            <span
                              className={`delivery-dot ${(mailItem as Outgoing).last_event}`}
                            />
                            {statusLabel((mailItem as Outgoing).last_event)}
                          </>
                        ) : (
                          <>
                            {stripAddress(mailItem.from)}
                            {"attachments" in mailItem &&
                            mailItem.attachments.length ? (
                              <>
                                <span> · </span>
                                <Paperclip size={12} /> Əlavə fayl
                              </>
                            ) : null}
                          </>
                        )}
                      </p>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="webmail-none">
                <i>
                  {query || filter !== "all" ? (
                    <Search size={25} />
                  ) : (
                    <Check size={25} />
                  )}
                </i>
                <h2>
                  {query || filter !== "all"
                    ? "Nəticə tapılmadı"
                    : "Hər şey qaydasındadır"}
                </h2>
                <p>
                  {query || filter !== "all"
                    ? "Axtarışı və ya filtrləri dəyişərək yenidən yoxlayın."
                    : "Bu qovluqda məktub yoxdur."}
                </p>
                {filter !== "all" ? (
                  <button onClick={() => setFilter("all")}>
                    Filtri təmizlə
                  </button>
                ) : null}
              </div>
            )}
          </section>

          <section className="webmail-reader" aria-label="Məktub oxuma paneli">
            {selected ? (
              loadingDetail && !detail ? (
                <div className="reader-loading">
                  <span />
                  <p>Məktub açılır...</p>
                </div>
              ) : detail ? (
                <>
                  <div className="reader-mobile-bar">
                    <IconButton
                      label="Siyahıya qayıt"
                      onClick={() => {
                        setSelected(null);
                        setDetail(null);
                      }}
                    >
                      <ArrowLeft size={20} />
                    </IconButton>
                    <span>Məktuba qayıt</span>
                  </div>
                  <div className="reader-head">
                    <div>
                      <small>{folderMeta[folder].label}</small>
                      <h2>{detail.subject || "Mövzusuz"}</h2>
                    </div>
                    <div className="reader-tools">
                      <IconButton
                        label={
                          folder === "archive" ||
                          folder === "trash" ||
                          folder === "spam"
                            ? "Gələnlərə qaytar"
                            : "Arxivlə"
                        }
                        onClick={() =>
                          moveMessages(
                            [detail.id],
                            folder === "archive" ||
                              folder === "trash" ||
                              folder === "spam"
                              ? "inbox"
                              : "archive",
                          )
                        }
                      >
                        {folder === "archive" ||
                        folder === "trash" ||
                        folder === "spam" ? (
                          <Inbox size={18} />
                        ) : (
                          <Archive size={18} />
                        )}
                      </IconButton>
                      {folder !== "sent" ? (
                        <IconButton
                          label={
                            stateFor(detail.id)?.is_read
                              ? "Oxunmamış et"
                              : "Oxunmuş et"
                          }
                          onClick={() =>
                            markRead(
                              [detail.id],
                              !(stateFor(detail.id)?.is_read ?? true),
                            )
                          }
                        >
                          {stateFor(detail.id)?.is_read ? (
                            <Mail size={18} />
                          ) : (
                            <MailOpen size={18} />
                          )}
                        </IconButton>
                      ) : null}
                      {folder !== "spam" && folder !== "sent" ? (
                        <IconButton
                          label="Spam kimi işarələ"
                          onClick={() => moveMessages([detail.id], "spam")}
                        >
                          <CircleAlert size={18} />
                        </IconButton>
                      ) : null}
                      {folder !== "trash" ? (
                        <IconButton
                          label="Zibilə köçür"
                          onClick={() => moveMessages([detail.id], "trash")}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      ) : null}
                      <IconButton
                        label={
                          starred.includes(detail.id) ? "Ulduzu sil" : "Ulduzla"
                        }
                        active={starred.includes(detail.id)}
                        onClick={() => toggleStar(detail.id)}
                      >
                        <Star
                          size={18}
                          fill={
                            starred.includes(detail.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </IconButton>
                      <div className="reader-nav">
                        <IconButton
                          label="Əvvəlki məktub"
                          disabled={selectedIndex <= 0}
                          onClick={() =>
                            selectedIndex > 0 &&
                            openMessage(list[selectedIndex - 1].id)
                          }
                        >
                          <ChevronLeft size={18} />
                        </IconButton>
                        <IconButton
                          label="Növbəti məktub"
                          disabled={
                            selectedIndex < 0 ||
                            selectedIndex >= list.length - 1
                          }
                          onClick={() =>
                            selectedIndex >= 0 &&
                            selectedIndex < list.length - 1 &&
                            openMessage(list[selectedIndex + 1].id)
                          }
                        >
                          <ChevronRight size={18} />
                        </IconButton>
                      </div>
                      <IconButton label="Çap et" onClick={() => window.print()}>
                        <Printer size={18} />
                      </IconButton>
                    </div>
                  </div>
                  <div className="reader-from">
                    <i>{initials(detail.from)}</i>
                    <div>
                      <b>{displayName(detail.from)}</b>
                      <span>{stripAddress(detail.from)}</span>
                      <details>
                        <summary>kimə: {detail.to.join(", ")}</summary>
                        <dl>
                          <dt>Göndərən</dt>
                          <dd>{detail.from}</dd>
                          <dt>Kimə</dt>
                          <dd>{detail.to.join(", ")}</dd>
                          {detail.cc?.length ? (
                            <>
                              <dt>CC</dt>
                              <dd>{detail.cc.join(", ")}</dd>
                            </>
                          ) : null}
                          <dt>Tarix</dt>
                          <dd>{fullDate(detail.created_at)}</dd>
                        </dl>
                      </details>
                    </div>
                    <time translate="no" suppressHydrationWarning>
                      {fullDate(detail.created_at)}
                    </time>
                    <IconButton
                      label="Cavabla"
                      onClick={() =>
                        openComposer({
                          to: detail.reply_to?.[0] || stripAddress(detail.from),
                          subject: `Re: ${detail.subject}`,
                        })
                      }
                    >
                      <Reply size={18} />
                    </IconButton>
                    <IconButton label="Digər əməliyyatlar">
                      <MoreHorizontal size={19} />
                    </IconButton>
                  </div>
                  <div className="reader-body">
                    {thread.length > 1 ? (
                      <div className="reader-thread">
                        <div>
                          <b>{thread.length} məktubluq yazışma</b>
                          <span>Əvvəlki məktubları göstərmək üçün açın</span>
                        </div>
                        {thread
                          .filter((item) => item.id !== detail.id)
                          .map((item) => (
                            <details key={item.id}>
                              <summary>
                                <span>{initials(item.from)}</span>
                                <b>{displayName(item.from)}</b>
                                <time translate="no" suppressHydrationWarning>
                                  {shortDate(item.created_at)}
                                </time>
                                <ChevronDown size={16} />
                              </summary>
                              <div>{item.text || "HTML formatlı məktub"}</div>
                            </details>
                          ))}
                      </div>
                    ) : null}
                    {detail.html ? (
                      <iframe
                        className="reader-html"
                        title="Məktub məzmunu"
                        sandbox="allow-same-origin"
                        srcDoc={detail.html}
                        onLoad={(event) => {
                          const document = event.currentTarget.contentDocument;
                          if (!document) return;
                          const height = Math.min(
                            Math.max(
                              document.body.scrollHeight,
                              document.documentElement.scrollHeight,
                              72,
                            ),
                            2400,
                          );
                          event.currentTarget.style.height = `${height}px`;
                        }}
                      />
                    ) : detail.text ? (
                      <p className="reader-text">{detail.text}</p>
                    ) : (
                      <p className="reader-muted">
                        Bu məktubun mətn versiyası yoxdur.
                      </p>
                    )}
                  </div>
                  {detail.attachments.length ? (
                    <div className="reader-files">
                      <div className="reader-files-title">
                        <Paperclip size={17} />
                        <b>{detail.attachments.length} əlavə</b>
                      </div>
                      <div>
                        {detail.attachments.map((file) => (
                          <a
                            key={file.id}
                            href={file.download_url || "#"}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i>
                              <FileText size={20} />
                            </i>
                            <span>
                              <b>{file.filename || "Fayl"}</b>
                              <small>
                                {Math.max(1, Math.ceil(file.size / 1024))} KB
                              </small>
                            </span>
                            <Download size={17} />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="reader-actions">
                    <button
                      onClick={() =>
                        openComposer({
                          to: detail.reply_to?.[0] || stripAddress(detail.from),
                          subject: `Re: ${detail.subject}`,
                        })
                      }
                    >
                      <Reply size={17} />
                      Cavabla
                    </button>
                    <button
                      onClick={() =>
                        openComposer({
                          to: [...detail.to, ...(detail.cc || [])]
                            .filter(
                              (address) =>
                                stripAddress(address) !== accountEmail,
                            )
                            .join(", "),
                          cc: stripAddress(detail.from),
                          subject: `Re: ${detail.subject}`,
                        })
                      }
                    >
                      <ReplyAll size={17} />
                      Hamısına cavab ver
                    </button>
                    <button
                      onClick={() =>
                        openComposer({
                          subject: `Fwd: ${detail.subject}`,
                          message: `\n\n---------- Yönləndirilmiş məktub ----------\nKimdən: ${detail.from}\nTarix: ${fullDate(detail.created_at)}\nMövzu: ${detail.subject}\nKimə: ${detail.to.join(", ")}\n\n${detail.text || ""}`,
                        })
                      }
                    >
                      <Forward size={17} />
                      Yönləndir
                    </button>
                  </div>
                </>
              ) : (
                <div className="reader-loading">
                  <span />
                  <p>Məktub açılır...</p>
                </div>
              )
            ) : (
              <div className="reader-placeholder">
                <i>
                  <Mail size={27} />
                </i>
                <h2>Oxumağa hazırsınız</h2>
                <p>Məzmunu burada görmək üçün siyahıdan məktub seçin.</p>
                <span>
                  <kbd>↑</kbd>
                  <kbd>↓</kbd> ilə məktublar arasında keçin
                </span>
              </div>
            )}
          </section>
        </div>
      </section>

      {compose ? (
        <div
          className={`compose-modal${composeMinimized ? " is-minimized" : ""}`}
        >
          <div className="compose-window">
            <div className="compose-titlebar">
              <div>
                <span className="compose-status-dot" />
                <b>{reply.id ? "Qaralamanı redaktə et" : "Yeni məktub"}</b>
              </div>
              <div>
                <IconButton
                  label={composeMinimized ? "Böyüt" : "Kiçilt"}
                  onClick={() => setComposeMinimized((value) => !value)}
                >
                  <span className="minimize-icon" />
                </IconButton>
                <IconButton label="Bağla" onClick={() => setCompose(false)}>
                  <X size={18} />
                </IconButton>
              </div>
            </div>
            {!composeMinimized ? (
              <ComposeForm
                initial={reply}
                displayName={preferences.displayName}
                signature={reply.id ? "" : preferences.signature}
                contacts={contacts}
                templates={preferences.templates}
                onSent={() => {
                  setCompose(false);
                  notify("Məktub uğurla göndərildi");
                  window.setTimeout(() => location.reload(), 800);
                }}
                onDiscard={(draftId) => {
                  if (draftId)
                    setDrafts((items) =>
                      items.filter((item) => item.id !== draftId),
                    );
                  setCompose(false);
                  notify("Qaralama silindi");
                }}
              />
            ) : null}
          </div>
        </div>
      ) : null}
      {settingsOpen ? (
        <MailSettings
          value={preferences}
          accountEmail={accountEmail}
          onClose={() => setSettingsOpen(false)}
          onSave={savePreferences}
        />
      ) : null}
      {toast ? (
        <div className="mail-toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      ) : null}
    </main>
  );
}

function MailSettings({
  value,
  accountEmail,
  onClose,
  onSave,
}: {
  value: MailPreferences;
  accountEmail: string;
  onClose: () => void;
  onSave: (value: MailPreferences) => void | Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <div className="mail-settings-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="mail-settings"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mail-settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <small>ŞƏXSİLƏŞDİRMƏ</small>
            <h2 id="mail-settings-title">Poçt parametrləri</h2>
          </div>
          <IconButton label="Bağla" onClick={onClose}><X size={19} /></IconButton>
        </header>
        <div className="mail-settings-account">
          <i>{draft.avatar ? <Image src={draft.avatar} alt="Profil şəkli" width={160} height={160} unoptimized /> : <UserRound size={20} />}</i>
          <span><b>{accountEmail}</b><small>Aktiv poçt hesabı</small></span>
          <label className="mail-avatar-upload">
            Şəkil seç
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file || file.size > 5 * 1024 * 1024) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const image = new window.Image();
                  image.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = 160;
                    canvas.height = 160;
                    const context = canvas.getContext("2d");
                    if (!context) return;
                    const side = Math.min(image.width, image.height);
                    context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 160, 160);
                    setDraft((current) => ({ ...current, avatar: canvas.toDataURL("image/webp", 0.82) }));
                  };
                  image.src = String(reader.result);
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {draft.avatar ? <button type="button" className="mail-avatar-remove" onClick={() => setDraft({ ...draft, avatar: "" })}>Sil</button> : null}
        </div>
        <label>
          <span>Göndərən adı</span>
          <small>Alıcı məktubda bu adı görəcək.</small>
          <input
            value={draft.displayName}
            maxLength={120}
            onChange={(event) => setDraft({ ...draft, displayName: event.target.value })}
            placeholder="Məsələn: Sapiens Pay"
          />
        </label>
        <label>
          <span>Standart imza</span>
          <small>Yeni məktublara və cavablara avtomatik əlavə olunur.</small>
          <textarea
            value={draft.signature}
            rows={7}
            maxLength={4000}
            onChange={(event) => setDraft({ ...draft, signature: event.target.value })}
            placeholder={"Hörmətlə,\nAd Soyad\nSapiens Pay"}
          />
        </label>
        <label className="mail-settings-toggle">
          <span><Bell size={18} /><b>Brauzer bildirişləri</b><small>Yeni oxunmamış məktublar barədə xəbər alın.</small></span>
          <input
            type="checkbox"
            checked={draft.notifications}
            onChange={(event) => setDraft({ ...draft, notifications: event.target.checked })}
          />
        </label>
        <div className="mail-template-settings">
          <div>
            <span>Hazır cavab şablonları</span>
            <small>Tez-tez istifadə etdiyiniz mətnləri bir kliklə məktuba əlavə edin.</small>
          </div>
          {draft.templates.map((template, index) => (
            <div className="mail-template-row" key={template.id}>
              <input
                value={template.name}
                placeholder="Şablonun adı"
                onChange={(event) => setDraft({
                  ...draft,
                  templates: draft.templates.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item),
                })}
              />
              <textarea
                value={template.body}
                rows={3}
                placeholder="Şablon mətni"
                onChange={(event) => setDraft({
                  ...draft,
                  templates: draft.templates.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item),
                })}
              />
              <button type="button" onClick={() => setDraft({ ...draft, templates: draft.templates.filter((_, itemIndex) => itemIndex !== index) })}>Sil</button>
            </div>
          ))}
          <button
            type="button"
            className="mail-template-add"
            onClick={() => setDraft({
              ...draft,
              templates: [...draft.templates, { id: crypto.randomUUID(), name: "Yeni şablon", body: "" }],
            })}
          >+ Yeni şablon</button>
        </div>
        <footer>
          <button type="button" onClick={onClose}>Ləğv et</button>
          <button type="button" className="primary" onClick={() => void onSave(draft)}>Yadda saxla</button>
        </footer>
      </section>
    </div>
  );
}
