import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "sapiens_mail_session";
const MAX_AGE = 60 * 60 * 12;

export type MailCredentials = { email: string; password: string };

function key() {
  const secret = process.env.MAIL_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error("MAIL_SESSION_SECRET is missing.");
  return createHash("sha256").update(secret).digest();
}

function seal(value: MailCredentials) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify({ ...value, expiresAt: Date.now() + MAX_AGE * 1000 }), "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((part) => part.toString("base64url"))
    .join(".");
}

function open(token: string): MailCredentials | null {
  try {
    const [iv, tag, encrypted] = token.split(".").map((part) => Buffer.from(part, "base64url"));
    if (!iv || !tag || !encrypted) return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const parsed = JSON.parse(
      Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8"),
    ) as MailCredentials & { expiresAt: number };
    if (
      parsed.expiresAt < Date.now() ||
      !parsed.email.endsWith("@sapiens-pay.com") ||
      !parsed.password
    ) return null;
    return { email: parsed.email, password: parsed.password };
  } catch {
    return null;
  }
}

export async function setMailSession(credentials: MailCredentials) {
  const store = await cookies();
  store.set(COOKIE, seal(credentials), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getMailSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  return token ? open(token) : null;
}

export async function clearMailSession() {
  const store = await cookies();
  store.delete(COOKIE);
}
