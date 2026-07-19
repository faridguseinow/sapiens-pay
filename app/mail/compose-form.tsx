"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendMail } from "./actions";

export function ComposeForm({
  initial = {},
  onSent,
}: {
  initial?: {
    id?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    message?: string;
  };
  onSent?: () => void;
}) {
  const [state, action, pending] = useActionState(sendMail, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draftId, setDraftId] = useState(initial.id);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (state?.success) onSent?.();
  }, [state?.success, onSent]);
  const autosave = () => {
    if (timer.current) clearTimeout(timer.current);
    setSaved(false);
    timer.current = setTimeout(async () => {
      if (!formRef.current) return;
      const data = new FormData(formRef.current);
      const response = await fetch("/api/mail/drafts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: draftId,
          recipients: [String(data.get("to") || "")].filter(Boolean),
          cc: String(data.get("cc") || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          bcc: String(data.get("bcc") || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          subject: String(data.get("subject") || ""),
          body: String(data.get("message") || ""),
        }),
      });
      if (response.ok) {
        const draft = await response.json();
        setDraftId(draft.id);
        setSaved(true);
      }
    }, 700);
  };
  return (
    <form
      ref={formRef}
      action={action}
      onInput={autosave}
      className="mail-compose"
    >
      <input type="hidden" name="draftId" value={draftId || ""} />
      <h2>Yeni məktub</h2>
      <label>
        Kimə
        <input
          name="to"
          type="email"
          defaultValue={initial.to}
          placeholder="name@example.com"
          required
        />
      </label>
      <details>
        <summary>CC / BCC</summary>
        <label>
          CC
          <input
            name="cc"
            type="text"
            defaultValue={initial.cc}
            placeholder="cc@example.com"
          />
        </label>
        <label>
          BCC
          <input
            name="bcc"
            type="text"
            defaultValue={initial.bcc}
            placeholder="bcc@example.com"
          />
        </label>
      </details>
      <label>
        Mövzu
        <input name="subject" defaultValue={initial.subject} required />
      </label>
      <label>
        Mesaj
        <textarea
          name="message"
          defaultValue={initial.message}
          rows={12}
          required
        />
      </label>
      <label className="compose-file">
        📎 Fayl əlavə et
        <input name="attachments" type="file" multiple />
      </label>
      {state?.error ? <p className="mail-error">{state.error}</p> : null}
      {state?.success ? <p className="mail-success">{state.success}</p> : null}
      {saved ? (
        <small className="draft-saved">Qaralama saxlanıldı</small>
      ) : null}
      <button disabled={pending}>{pending ? "Göndərilir..." : "Göndər"}</button>
    </form>
  );
}
