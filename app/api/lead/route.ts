import { google } from "googleapis";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadPayload = {
  locale: string;
  estimatedLoss: number;
  contact: {
    name: string;
    phone: string;
    preferredContact: string;
  };
  profile: {
    businessType: string;
    adBudget: string;
    commissionAmount: string;
    growthPlan: string;
  };
  qa: Array<{ question: string; answer: string }>;
  submittedAt: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 12px;border-bottom:1px solid #e8ebed;color:#5b6169;font-size:13px;width:34%;">${escapeHtml(label)}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #e8ebed;color:#111827;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
  </tr>
`;

function buildHtml(payload: LeadPayload) {
  const submittedDate = new Date(payload.submittedAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const qaRows = payload.qa
    .map((item) => row(item.question, item.answer))
    .join("");

  return `
  <div style="margin:0;padding:24px;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e4e7ea;border-radius:16px;overflow:hidden;">
      <div style="padding:20px 22px;background:linear-gradient(135deg,#111827,#1f2937);color:#f8fafc;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <h1 style="margin:0;font-size:20px;line-height:1.2;">New Lead Application</h1>
          <span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#d9eb4f;color:#111827;font-size:12px;font-weight:700;">
            Sapiens Pay
          </span>
        </div>
        <p style="margin:10px 0 0;color:#dbe3eb;font-size:13px;">Submitted: ${escapeHtml(submittedDate)} | Locale: ${escapeHtml(payload.locale.toUpperCase())}</p>
      </div>

      <div style="padding:18px 22px;border-bottom:1px solid #edf0f2;">
        <h2 style="margin:0 0 10px;font-size:16px;color:#111827;">Quick Summary</h2>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;">
          <div style="background:#f8fafb;border:1px solid #e7ecef;border-radius:12px;padding:10px;">
            <p style="margin:0 0 5px;font-size:12px;color:#6b7280;">Name</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#111827;">${escapeHtml(payload.contact.name)}</p>
          </div>
          <div style="background:#f8fafb;border:1px solid #e7ecef;border-radius:12px;padding:10px;">
            <p style="margin:0 0 5px;font-size:12px;color:#6b7280;">Phone</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#111827;">${escapeHtml(payload.contact.phone)}</p>
          </div>
          <div style="background:#f8fafb;border:1px solid #e7ecef;border-radius:12px;padding:10px;">
            <p style="margin:0 0 5px;font-size:12px;color:#6b7280;">Estimated Yearly Loss</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#7a870f;">${escapeHtml(String(payload.estimatedLoss))} AZN</p>
          </div>
        </div>
      </div>

      <div style="padding:16px 22px;">
        <h3 style="margin:0 0 10px;font-size:15px;color:#111827;">Client Profile</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e8ebed;border-radius:12px;overflow:hidden;">
          <tbody>
            ${row("Business Type", payload.profile.businessType)}
            ${row("Ad Budget", payload.profile.adBudget)}
            ${row("Monthly Commission", payload.profile.commissionAmount)}
            ${row("Growth Plan", payload.profile.growthPlan)}
            ${row("Preferred Contact", payload.contact.preferredContact)}
          </tbody>
        </table>
      </div>

      <div style="padding:0 22px 22px;">
        <h3 style="margin:0 0 10px;font-size:15px;color:#111827;">Full Answers</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e8ebed;border-radius:12px;overflow:hidden;">
          <tbody>${qaRows}</tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

function validatePayload(data: unknown): data is LeadPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as Partial<LeadPayload>;
  if (!payload.contact?.name || !payload.contact.phone) return false;
  if (!payload.profile) return false;
  if (!Array.isArray(payload.qa) || payload.qa.length < 6) return false;
  return true;
}

async function appendLeadToSheet(payload: LeadPayload) {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME ?? "Leads";

  // If Google Sheets is not configured yet, skip without failing lead submit.
  if (!clientEmail || !privateKeyRaw || !spreadsheetId) {
    return;
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const row = [
    new Date(payload.submittedAt).toISOString(),
    payload.locale,
    payload.contact.name,
    payload.contact.phone,
    payload.contact.preferredContact,
    payload.estimatedLoss,
    payload.profile.businessType,
    payload.profile.adBudget,
    payload.profile.commissionAmount,
    payload.profile.growthPlan,
    payload.qa.map((item) => `${item.question}: ${item.answer}`).join(" | "),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:K`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!validatePayload(body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const host = request.headers.get("host") ?? "unknown-host";

    if (!gmailUser || !gmailAppPassword) {
      const missing = [
        !gmailUser ? "GMAIL_USER" : null,
        !gmailAppPassword ? "GMAIL_APP_PASSWORD" : null,
      ].filter(Boolean);

      return NextResponse.json(
        {
          error: "Mail credentials are not configured",
          detail: `Missing env: ${missing.join(", ")} | host: ${host}`,
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const toEmail = process.env.LEAD_TO_EMAIL ?? "sapienspay@gmail.com";
    const subject = `Lead: ${body.contact.name} | ${body.contact.phone} | yearly ~${body.estimatedLoss} AZN`;

    const mailPromise = transporter.sendMail({
      from: process.env.LEAD_FROM_EMAIL ?? `Sapiens Pay Leads <${gmailUser}>`,
      to: toEmail,
      replyTo: process.env.LEAD_REPLY_TO ?? gmailUser,
      subject,
      text: [
        `New lead from website`,
        `Name: ${body.contact.name}`,
        `Phone: ${body.contact.phone}`,
        `Preferred Contact: ${body.contact.preferredContact}`,
        `Estimated Yearly Loss: ${body.estimatedLoss} AZN`,
        "",
        "Answers:",
        ...body.qa.map((item) => `- ${item.question}: ${item.answer}`),
      ].join("\n"),
      html: buildHtml(body),
    });

    const sheetPromise = appendLeadToSheet(body);
    await Promise.all([mailPromise, sheetPromise]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while sending lead email";
    console.error("[api/lead] Failed to send lead email:", error);
    return NextResponse.json({ error: "Unexpected error", detail: message }, { status: 500 });
  }
}
