"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function MailboxManager({
  mailbox,
  children,
}: {
  mailbox: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button type="button" className="mail-admin-manage-button" onClick={() => setOpen(true)}>
        İdarə et
      </button>
      {open
        ? createPortal(
            <div
              className="mail-admin-modal-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
            >
              <section
                className="mail-admin-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
              >
                <header>
                  <div>
                    <span>Mailbox idarəetməsi</span>
                    <h2 id={titleId}>{mailbox}</h2>
                  </div>
                  <button type="button" onClick={() => setOpen(false)} aria-label="Pəncərəni bağla">
                    ×
                  </button>
                </header>
                <div className="mail-admin-modal__content">{children}</div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
