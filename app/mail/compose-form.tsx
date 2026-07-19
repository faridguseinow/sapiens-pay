"use client";

import {
  AlertCircle,
  Bold,
  ChevronDown,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Send,
  Smile,
  Trash2,
  Underline,
  X,
} from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendMail } from "./actions";

type InitialCompose = {
  id?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  message?: string;
};

const splitRecipients = (value: string) =>
  value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);

export function ComposeForm({
  initial = {},
  onSent,
  onDiscard,
}: {
  initial?: InitialCompose;
  onSent?: () => void;
  onDiscard?: (draftId?: string) => void;
}) {
  const [state, action, pending] = useActionState(sendMail, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draftId, setDraftId] = useState(initial.id);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [showCopies, setShowCopies] = useState(
    Boolean(initial.cc || initial.bcc),
  );
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (state?.success) onSent?.();
  }, [onSent, state?.success]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const autosave = () => {
    if (timer.current) clearTimeout(timer.current);
    setSaveState("saving");
    timer.current = setTimeout(async () => {
      if (!formRef.current) return;
      const data = new FormData(formRef.current);
      const response = await fetch("/api/mail/drafts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: draftId,
          recipients: splitRecipients(String(data.get("to") || "")),
          cc: splitRecipients(String(data.get("cc") || "")),
          bcc: splitRecipients(String(data.get("bcc") || "")),
          subject: String(data.get("subject") || ""),
          body: String(data.get("message") || ""),
        }),
      });
      if (response.ok) {
        const draft = await response.json();
        setDraftId(draft.id);
        setSaveState("saved");
      } else setSaveState("error");
    }, 800);
  };

  const insertText = (before: string, after = before) => {
    const field = messageRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    field.setRangeText(
      `${before}${field.value.slice(start, end)}${after}`,
      start,
      end,
      "end",
    );
    field.focus();
    autosave();
  };

  const discard = async () => {
    if (timer.current) clearTimeout(timer.current);
    if (draftId)
      await fetch(`/api/mail/drafts?id=${draftId}`, { method: "DELETE" });
    onDiscard?.(draftId);
  };

  return (
    <form
      ref={formRef}
      action={action}
      onInput={autosave}
      className="mail-compose"
    >
      <input type="hidden" name="draftId" value={draftId || ""} />
      <div className="compose-address-row">
        <label htmlFor="compose-to">Kimə</label>
        <input
          id="compose-to"
          name="to"
          type="text"
          defaultValue={initial.to}
          placeholder="Alıcının e-poçt ünvanı"
          autoFocus
          required
        />
        <button type="button" onClick={() => setShowCopies((value) => !value)}>
          CC / BCC <ChevronDown size={14} />
        </button>
      </div>
      {showCopies ? (
        <div className="compose-copy-fields">
          <div className="compose-address-row">
            <label htmlFor="compose-cc">CC</label>
            <input
              id="compose-cc"
              name="cc"
              type="text"
              defaultValue={initial.cc}
              placeholder="Surət göndəriləcək ünvanlar"
            />
          </div>
          <div className="compose-address-row">
            <label htmlFor="compose-bcc">BCC</label>
            <input
              id="compose-bcc"
              name="bcc"
              type="text"
              defaultValue={initial.bcc}
              placeholder="Gizli surət ünvanları"
            />
          </div>
        </div>
      ) : (
        <>
          <input type="hidden" name="cc" value={initial.cc || ""} />
          <input type="hidden" name="bcc" value={initial.bcc || ""} />
        </>
      )}
      <div className="compose-subject">
        <input
          name="subject"
          defaultValue={initial.subject}
          placeholder="Mövzu"
          aria-label="Mövzu"
          required
        />
      </div>
      <div className="compose-formatbar" aria-label="Mətn formatlama alətləri">
        <button type="button" title="Qalın" onClick={() => insertText("**")}>
          <Bold size={16} />
        </button>
        <button type="button" title="Maili" onClick={() => insertText("_")}>
          <Italic size={16} />
        </button>
        <button
          type="button"
          title="Altıxətli"
          onClick={() => insertText("__")}
        >
          <Underline size={16} />
        </button>
        <span />
        <button
          type="button"
          title="Siyahı"
          onClick={() => insertText("\n• ", "")}
        >
          <List size={17} />
        </button>
        <button
          type="button"
          title="Nömrəli siyahı"
          onClick={() => insertText("\n1. ", "")}
        >
          <ListOrdered size={17} />
        </button>
        <button
          type="button"
          title="Keçid"
          onClick={() => insertText("[", "](https://)")}
        >
          <Link2 size={16} />
        </button>
      </div>
      <textarea
        ref={messageRef}
        name="message"
        defaultValue={initial.message}
        rows={15}
        placeholder="Məktubunuzu yazın..."
        aria-label="Məktub mətni"
        required
      />
      {files.length ? (
        <div className="compose-attachments">
          {files.map((file, index) => (
            <span key={`${file.name}-${file.size}`}>
              <Paperclip size={14} />
              <b>{file.name}</b>
              <small>{Math.max(1, Math.ceil(file.size / 1024))} KB</small>
              <button
                type="button"
                aria-label={`${file.name} faylını sil`}
                onClick={() => {
                  const transfer = new DataTransfer();
                  files
                    .filter((_, itemIndex) => itemIndex !== index)
                    .forEach((item) => transfer.items.add(item));
                  if (fileRef.current) fileRef.current.files = transfer.files;
                  setFiles(Array.from(transfer.files));
                }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      {state?.error ? (
        <p className="mail-error" role="alert">
          <AlertCircle size={16} />
          {state.error}
        </p>
      ) : null}
      <div className="compose-footer">
        <button className="compose-send" disabled={pending}>
          {pending ? <span className="button-spinner" /> : <Send size={17} />}
          {pending ? "Göndərilir" : "Göndər"}
        </button>
        <div className="compose-footer-tools">
          <button
            type="button"
            title="Fayl əlavə et"
            onClick={() => fileRef.current?.click()}
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileRef}
            name="attachments"
            type="file"
            multiple
            hidden
            onChange={(event) => setFiles(Array.from(event.target.files || []))}
          />
          <button
            type="button"
            title="Şəkil əlavə et"
            onClick={() => fileRef.current?.click()}
          >
            <ImageIcon size={18} />
          </button>
          <button
            type="button"
            title="Emoji"
            onClick={() => insertText("🙂", "")}
          >
            <Smile size={18} />
          </button>
        </div>
        <span className={`draft-state ${saveState}`} aria-live="polite">
          {saveState === "saving"
            ? "Saxlanılır..."
            : saveState === "saved"
              ? "Qaralama saxlanıldı"
              : saveState === "error"
                ? "Saxlanmadı"
                : ""}
        </span>
        <button
          type="button"
          className="compose-discard"
          title="Qaralamanı sil"
          onClick={discard}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </form>
  );
}
