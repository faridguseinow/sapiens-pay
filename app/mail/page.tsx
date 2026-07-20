import { redirect } from "next/navigation";
import { getResend } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import { MailClient } from "./mail-client";
import { listImapMessages } from "@/lib/mail/imap";
import {
  getSelfHostedMailConfig,
  isSelfHostedMailEnabled,
} from "@/lib/mail/self-hosted-config";

export const dynamic = "force-dynamic";

export default async function MailPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) redirect("/mail/login");
  const draftRequest = supabase
    .from("mail_drafts")
    .select("id,recipients,cc,bcc,subject,body,updated_at")
    .order("updated_at", { ascending: false });
  if (isSelfHostedMailEnabled()) {
    const folders = ["INBOX", "Archive", "Junk", "Trash"] as const;
    const [sent, draftResult, ...receivedFolders] = await Promise.all([
      listImapMessages("Sent", { limit: 100 }),
      draftRequest,
      ...folders.map((folder) => listImapMessages(folder, { limit: 100 })),
    ]);
    const folderState = {
      INBOX: "inbox",
      Archive: "archive",
      Junk: "spam",
      Trash: "trash",
    } as const;
    const received = receivedFolders.flat();
    return (
      <MailClient
        incoming={received.map((item) => ({
          id: item.id,
          from: item.from,
          to: item.to,
          subject: item.subject,
          created_at: item.createdAt,
          attachments: item.hasAttachments ? [{ id: "attachment" }] : [],
        }))}
        outgoing={sent.map((item) => ({
          id: item.id,
          from: item.from,
          to: item.to,
          subject: item.subject,
          created_at: item.createdAt,
          last_event: "sent",
        }))}
        initialStates={received.map((item) => ({
          message_id: item.id,
          folder: folderState[item.mailbox as keyof typeof folderState] || "inbox",
          is_read: item.isRead,
          is_starred: item.isStarred,
        }))}
        initialDrafts={draftResult.data ?? []}
        accountEmail={getSelfHostedMailConfig().mailbox}
      />
    );
  }
  const resend = getResend();
  const [incoming, outgoing, stateResult, draftResult] = await Promise.all([
    resend.emails.receiving.list({ limit: 100 }),
    resend.emails.list({ limit: 100 }),
    supabase.from("mail_states").select("message_id,folder,is_read,is_starred"),
    draftRequest,
  ]);
  return (
    <MailClient
      incoming={incoming.data?.data ?? []}
      outgoing={outgoing.data?.data ?? []}
      initialStates={stateResult.data ?? []}
      initialDrafts={draftResult.data ?? []}
      accountEmail={String(auth.claims.email ?? "")}
    />
  );
}
