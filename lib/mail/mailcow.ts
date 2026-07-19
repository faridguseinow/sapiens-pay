import "server-only";

import { getSelfHostedMailConfig } from "./self-hosted-config";

async function mailcowRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getSelfHostedMailConfig();
  if (!config.mailcowApiUrl || !config.mailcowApiKey) {
    throw new Error("Mailcow API credentials are incomplete.");
  }
  const response = await fetch(`${config.mailcowApiUrl}/api/v1${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      "X-API-Key": config.mailcowApiKey,
      ...init?.headers,
    },
  });
  if (!response.ok)
    throw new Error(`Mailcow API request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export type MailcowMailbox = {
  username: string;
  name: string;
  active: number;
  quota: number;
  quota_used?: number;
};

export function listMailcowMailboxes() {
  return mailcowRequest<MailcowMailbox[]>("/get/mailbox/all");
}

export function createMailcowMailbox(input: {
  localPart: string;
  domain?: string;
  displayName: string;
  password: string;
  quotaMb?: number;
}) {
  return mailcowRequest<Array<{ type: string; msg: string }>>("/add/mailbox", {
    method: "POST",
    body: JSON.stringify({
      local_part: input.localPart,
      domain: input.domain || "sapiens-pay.com",
      name: input.displayName,
      password: input.password,
      password2: input.password,
      quota: input.quotaMb || 2048,
      active: "1",
      force_pw_update: "1",
      tls_enforce_in: "1",
      tls_enforce_out: "1",
    }),
  });
}

export function deactivateMailcowMailbox(username: string) {
  return mailcowRequest<Array<{ type: string; msg: string }>>("/edit/mailbox", {
    method: "POST",
    body: JSON.stringify({ items: [username], attr: { active: "0" } }),
  });
}
