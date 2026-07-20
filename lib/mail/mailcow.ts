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
  active: number | string;
  quota: number;
  quota_used?: number;
  messages?: number;
  domain?: string;
  local_part?: string;
};

type MailcowOperationResult = {
  type: "success" | "danger" | "error";
  msg: string | string[];
};

function operation(
  path: string,
  body: unknown,
): Promise<MailcowOperationResult[]> {
  return mailcowRequest<MailcowOperationResult[]>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function assertMailcowSuccess(results: MailcowOperationResult[]) {
  const failure = results.find((result) => result.type !== "success");
  if (failure) {
    const message = Array.isArray(failure.msg)
      ? failure.msg.join(": ")
      : failure.msg;
    throw new Error(message || "Mailcow əməliyyatı tamamlanmadı.");
  }
  return results;
}

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
  return operation("/add/mailbox", {
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
  });
}

export function setMailcowMailboxActive(username: string, active: boolean) {
  return operation("/edit/mailbox", {
    items: [username],
    attr: { active: active ? "1" : "0" },
  });
}

export function changeMailcowMailboxPassword(
  username: string,
  password: string,
) {
  return operation("/edit/mailbox", {
    items: [username],
    attr: {
      password,
      password2: password,
      force_pw_update: "1",
    },
  });
}

export function deleteMailcowMailbox(username: string) {
  return operation("/delete/mailbox", [username]);
}
