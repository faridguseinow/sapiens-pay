"use client";

import { useEffect, useTransition } from "react";
import { markLeadRead } from "../../../actions";

export function MarkLeadRead({ id, isUnread }: { id: string; isUnread: boolean }) {
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!isUnread) return;
    startTransition(() => {
      void markLeadRead(id);
    });
  }, [id, isUnread]);

  return null;
}
