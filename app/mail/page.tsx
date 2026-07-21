import { redirect } from "next/navigation";
import { MailClient } from "./mail-client";
import { listImapDrafts, listImapMessages } from "@/lib/mail/imap";
import { getMailSession } from "@/lib/mail/session";

export const dynamic = "force-dynamic";

export default async function MailPage() {
  const mailSession = await getMailSession();
  if (!mailSession) redirect("/mail/login");
    const folders = ["INBOX", "Archive", "Junk", "Trash"] as const;
    const [sent, drafts, ...receivedFolders] = await Promise.all([
      listImapMessages("Sent", { limit: 100 }, mailSession!),
      listImapDrafts(mailSession!),
      ...folders.map((folder) => listImapMessages(folder, { limit: 100 }, mailSession!)),
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
        initialDrafts={drafts}
        accountEmail={mailSession.email}
      />
    );
}
