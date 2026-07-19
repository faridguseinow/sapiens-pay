import "server-only";

export type SelfHostedMailConfig = {
  hostname: string;
  mailbox: string;
  password: string;
  imapPort: number;
  smtpPort: number;
  mailcowApiUrl: string;
  mailcowApiKey: string;
};

const clean = (value: string | undefined) =>
  value?.trim().replace(/^['"]|['"]$/g, "") || "";

export function isSelfHostedMailEnabled() {
  return clean(process.env.MAIL_BACKEND).toLocaleLowerCase() === "self-hosted";
}

export function getSelfHostedMailConfig(): SelfHostedMailConfig {
  const config = {
    hostname: clean(process.env.MAIL_SERVER_HOST),
    mailbox: clean(process.env.MAIL_SERVER_USER),
    password: clean(process.env.MAIL_SERVER_PASSWORD),
    imapPort: Number(clean(process.env.MAIL_IMAP_PORT) || "993"),
    smtpPort: Number(clean(process.env.MAIL_SMTP_PORT) || "465"),
    mailcowApiUrl: clean(process.env.MAILCOW_API_URL).replace(/\/$/, ""),
    mailcowApiKey: clean(process.env.MAILCOW_API_KEY),
  };

  if (!config.hostname || !config.mailbox || !config.password) {
    throw new Error("Self-hosted mail server credentials are incomplete.");
  }
  if (
    !Number.isInteger(config.imapPort) ||
    !Number.isInteger(config.smtpPort)
  ) {
    throw new Error("Mail server ports are invalid.");
  }

  return config;
}
