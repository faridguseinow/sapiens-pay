import "server-only";

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { getSelfHostedMailConfig } from "./self-hosted-config";
import type { MailCredentials } from "./session";

export type ImapFolder = {
  path: string;
  name: string;
  specialUse: string | null;
};

export type ImapMessageSummary = {
  id: string;
  uid: number;
  mailbox: string;
  from: string;
  to: string[];
  subject: string;
  createdAt: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
};

export type ImapMessageDetail = ImapMessageSummary & {
  cc: string[];
  replyTo: string[];
  text: string | null;
  html: string | null;
  messageId: string | null;
  inReplyTo: string | null;
  references: string[];
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
    content: Buffer;
  }>;
};

export type ImapDraft = {
  id: string;
  recipients: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  updated_at: string;
};

const addressList = (
  addresses: Array<{ address?: string; name?: string }> | undefined,
) =>
  (addresses || [])
    .map((item) =>
      item.name && item.address
        ? `${item.name} <${item.address}>`
        : item.address || item.name || "",
    )
    .filter(Boolean);

const stableId = (mailbox: string, uid: number) =>
  `${encodeURIComponent(mailbox)}:${uid}`;

export function parseImapMessageId(id: string) {
  const separator = id.lastIndexOf(":");
  if (separator < 1) return null;
  const mailbox = decodeURIComponent(id.slice(0, separator));
  const uid = Number(id.slice(separator + 1));
  if (!mailbox || !Number.isSafeInteger(uid) || uid < 1) return null;
  return { mailbox, uid };
}

function createImapClient(credentials?: MailCredentials) {
  const config = getSelfHostedMailConfig();
  return new ImapFlow({
    host: config.hostname,
    port: config.imapPort,
    secure: true,
    auth: {
      user: credentials?.email || config.mailbox,
      pass: credentials?.password || config.password,
    },
    logger: false,
    tls: { minVersion: "TLSv1.2", servername: config.hostname },
  });
}

async function withImap<T>(
  callback: (client: ImapFlow) => Promise<T>,
  credentials?: MailCredentials,
) {
  const client = createImapClient(credentials);
  await client.connect();
  try {
    return await callback(client);
  } finally {
    await client.logout().catch(() => undefined);
  }
}

export async function listImapFolders(credentials?: MailCredentials): Promise<ImapFolder[]> {
  return withImap(async (client) => {
    const folders = await client.list();
    return folders.map((folder) => ({
      path: folder.path,
      name: folder.name,
      specialUse: folder.specialUse || null,
    }));
  }, credentials);
}

export async function verifyImapCredentials(credentials: MailCredentials) {
  return withImap(async () => true, credentials);
}

export async function listImapMessages(
  mailbox = "INBOX",
  options: { limit?: number; query?: string } = {},
  credentials?: MailCredentials,
): Promise<ImapMessageSummary[]> {
  const limit = Math.min(Math.max(options.limit || 100, 1), 250);
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(mailbox);
    try {
      const exists =
        client.mailbox && "exists" in client.mailbox
          ? client.mailbox.exists
          : 0;
      if (!exists) return [];
      let uids: number[];
      if (options.query?.trim()) {
        const found = await client.search(
          {
            or: [
              { subject: options.query.trim() },
              { from: options.query.trim() },
              { body: options.query.trim() },
            ],
          },
          { uid: true },
        );
        uids = found === false ? [] : found.slice(-limit);
      } else {
        const start = Math.max(1, exists - limit + 1);
        const messages = await client.fetchAll(`${start}:*`, {
          uid: true,
          envelope: true,
          flags: true,
          bodyStructure: true,
        });
        return messages.reverse().map((message) => ({
          id: stableId(mailbox, message.uid),
          uid: message.uid,
          mailbox,
          from: addressList(message.envelope?.from)[0] || "",
          to: addressList(message.envelope?.to),
          subject: message.envelope?.subject || "",
          createdAt: (message.envelope?.date || new Date(0)).toISOString(),
          isRead: message.flags?.has("\\Seen") || false,
          isStarred: message.flags?.has("\\Flagged") || false,
          hasAttachments: Boolean(
            message.bodyStructure?.childNodes?.some(
              (node) => node.disposition === "attachment",
            ),
          ),
        }));
      }

      if (!uids.length) return [];
      const messages = await client.fetchAll(
        uids,
        {
          uid: true,
          envelope: true,
          flags: true,
          bodyStructure: true,
        },
        { uid: true },
      );
      return messages.reverse().map((message) => ({
        id: stableId(mailbox, message.uid),
        uid: message.uid,
        mailbox,
        from: addressList(message.envelope?.from)[0] || "",
        to: addressList(message.envelope?.to),
        subject: message.envelope?.subject || "",
        createdAt: (message.envelope?.date || new Date(0)).toISOString(),
        isRead: message.flags?.has("\\Seen") || false,
        isStarred: message.flags?.has("\\Flagged") || false,
        hasAttachments: Boolean(
          message.bodyStructure?.childNodes?.some(
            (node) => node.disposition === "attachment",
          ),
        ),
      }));
    } finally {
      lock.release();
    }
  }, credentials);
}

export async function getImapMessage(
  mailbox: string,
  uid: number,
  credentials?: MailCredentials,
): Promise<ImapMessageDetail | null> {
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(mailbox);
    try {
      const message = await client.fetchOne(
        String(uid),
        { uid: true, source: true, flags: true },
        { uid: true },
      );
      if (!message || !message.source) return null;
      const parsed = await simpleParser(message.source);
      const html = typeof parsed.html === "string" ? parsed.html : null;
      return {
        id: stableId(mailbox, uid),
        uid,
        mailbox,
        from: parsed.from?.text || "",
        to: parsed.to
          ? (Array.isArray(parsed.to) ? parsed.to : [parsed.to]).map(
              (item) => item.text,
            )
          : [],
        cc: parsed.cc
          ? (Array.isArray(parsed.cc) ? parsed.cc : [parsed.cc]).map(
              (item) => item.text,
            )
          : [],
        replyTo: parsed.replyTo ? [parsed.replyTo.text] : [],
        subject: parsed.subject || "",
        createdAt: (parsed.date || new Date(0)).toISOString(),
        isRead: message.flags?.has("\\Seen") || false,
        isStarred: message.flags?.has("\\Flagged") || false,
        hasAttachments: parsed.attachments.length > 0,
        text: parsed.text || null,
        html,
        messageId: parsed.messageId || null,
        inReplyTo: parsed.inReplyTo || null,
        references: Array.isArray(parsed.references)
          ? parsed.references
          : parsed.references
            ? [parsed.references]
            : [],
        attachments: parsed.attachments.map((attachment) => ({
          filename: attachment.filename || "attachment",
          contentType: attachment.contentType,
          size: attachment.size,
          content: attachment.content,
        })),
      };
    } finally {
      lock.release();
    }
  }, credentials);
}

export async function updateImapFlags(
  mailbox: string,
  uids: number[],
  patch: { read?: boolean; starred?: boolean },
  credentials?: MailCredentials,
) {
  if (!uids.length) return;
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(mailbox);
    try {
      if (typeof patch.read === "boolean") {
        const operation = patch.read
          ? client.messageFlagsAdd.bind(client)
          : client.messageFlagsRemove.bind(client);
        await operation(uids, ["\\Seen"], { uid: true });
      }
      if (typeof patch.starred === "boolean") {
        const operation = patch.starred
          ? client.messageFlagsAdd.bind(client)
          : client.messageFlagsRemove.bind(client);
        await operation(uids, ["\\Flagged"], { uid: true });
      }
    } finally {
      lock.release();
    }
  }, credentials);
}

export async function moveImapMessages(
  mailbox: string,
  uids: number[],
  destination: string,
  credentials?: MailCredentials,
) {
  if (!uids.length) return;
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(mailbox);
    try {
      await client.messageMove(uids, destination, { uid: true });
    } finally {
      lock.release();
    }
  }, credentials);
}

export async function appendImapMessage(
  mailbox: string,
  source: Buffer,
  flags: string[] = ["\\Seen"],
  credentials?: MailCredentials,
) {
  return withImap(async (client) => {
    await client.append(mailbox, source, flags);
  }, credentials);
}

export async function deleteImapMessages(
  mailbox: string,
  uids: number[],
  credentials?: MailCredentials,
) {
  if (!uids.length) return;
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(mailbox);
    try {
      await client.messageDelete(uids, { uid: true });
    } finally {
      lock.release();
    }
  }, credentials);
}

export async function listImapDrafts(
  credentials: MailCredentials,
): Promise<ImapDraft[]> {
  return withImap(async (client) => {
    const lock = await client.getMailboxLock("Drafts");
    try {
      const exists = client.mailbox && "exists" in client.mailbox ? client.mailbox.exists : 0;
      if (!exists) return [];
      const start = Math.max(1, exists - 99);
      const messages = await client.fetchAll(`${start}:*`, { uid: true, source: true });
      const drafts = await Promise.all(messages.map(async (message) => {
        if (!message.source) return null;
        const parsed = await simpleParser(message.source);
        return {
          id: stableId("Drafts", message.uid),
          recipients: parsed.to ? (Array.isArray(parsed.to) ? parsed.to : [parsed.to]).flatMap((x) => addressList(x.value)) : [],
          cc: parsed.cc ? (Array.isArray(parsed.cc) ? parsed.cc : [parsed.cc]).flatMap((x) => addressList(x.value)) : [],
          bcc: parsed.bcc ? (Array.isArray(parsed.bcc) ? parsed.bcc : [parsed.bcc]).flatMap((x) => addressList(x.value)) : [],
          subject: parsed.subject || "",
          body: parsed.text || "",
          updated_at: (parsed.date || new Date()).toISOString(),
        } satisfies ImapDraft;
      }));
      return drafts.filter((item): item is ImapDraft => item !== null).reverse();
    } finally {
      lock.release();
    }
  }, credentials);
}
