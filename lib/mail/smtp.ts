import "server-only";

import nodemailer from "nodemailer";
import { getSelfHostedMailConfig } from "./self-hosted-config";
import { appendImapMessage } from "./imap";

export type SmtpAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export async function verifySmtpConnection() {
  const config = getSelfHostedMailConfig();
  const transport = nodemailer.createTransport({
    host: config.hostname,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    requireTLS: config.smtpPort !== 465,
    auth: { user: config.mailbox, pass: config.password },
    tls: { minVersion: "TLSv1.2", servername: config.hostname },
  });
  return transport.verify();
}

export async function sendSmtpMail(input: {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text: string;
  html?: string;
  inReplyTo?: string;
  references?: string[];
  attachments?: SmtpAttachment[];
}) {
  const config = getSelfHostedMailConfig();
  const message = {
    from: config.mailbox,
    to: input.to,
    cc: input.cc,
    bcc: input.bcc,
    subject: input.subject,
    text: input.text,
    html: input.html,
    inReplyTo: input.inReplyTo,
    references: input.references,
    attachments: input.attachments,
  };
  const builder = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: "unix",
  });
  const built = await builder.sendMail(message);
  if (!Buffer.isBuffer(built.message)) {
    throw new Error("Məktubun MIME məzmunu yaradıla bilmədi.");
  }
  const transport = nodemailer.createTransport({
    host: config.hostname,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    requireTLS: config.smtpPort !== 465,
    auth: { user: config.mailbox, pass: config.password },
    tls: { minVersion: "TLSv1.2", servername: config.hostname },
  });

  const result = await transport.sendMail({
    envelope: {
      from: config.mailbox,
      to: [...input.to, ...(input.cc || []), ...(input.bcc || [])],
    },
    raw: built.message,
  });
  await appendImapMessage("Sent", built.message);
  return result;
}
