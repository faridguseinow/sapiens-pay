type TelegramLead = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  packageName?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const isTelegramConfigured = Boolean(
  process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
);

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { skipped: true };

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return { error: `Telegram HTTP ${response.status}` };
    return { ok: true };
  } catch {
    return { error: "Telegram request failed" };
  }
}

export function newLeadTelegramText(lead: TelegramLead) {
  return [
    "🟢 <b>Yeni müraciət</b>",
    "",
    `👤 ${escapeHtml(lead.name)}`,
    `📞 ${escapeHtml(lead.phone)}`,
    lead.email ? `✉️ ${escapeHtml(lead.email)}` : "",
    `🧩 ${escapeHtml(lead.service || "Ümumi müraciət")}`,
    lead.packageName ? `📦 ${escapeHtml(lead.packageName)}` : "",
    lead.message ? `💬 ${escapeHtml(lead.message)}` : "",
  ].filter(Boolean).join("\n");
}

export function followUpTelegramText(lead: TelegramLead & { followUpAt: string }) {
  const time = new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Baku",
  }).format(new Date(lead.followUpAt));
  return [
    "⏰ <b>Əlaqə vaxtı çatıb</b>",
    "",
    `👤 ${escapeHtml(lead.name)}`,
    `📞 ${escapeHtml(lead.phone)}`,
    `🧩 ${escapeHtml(lead.service || "Ümumi müraciət")}`,
    lead.packageName ? `📦 ${escapeHtml(lead.packageName)}` : "",
    `🕐 ${escapeHtml(time)}`,
  ].filter(Boolean).join("\n");
}
