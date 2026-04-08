# Sapiens Pay

Landing page for Sapiens Pay (Azerbaijan market).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- SCSS (without Tailwind)

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Lead form email setup

The lead quiz submits data to `POST /api/lead` and sends an email using Gmail SMTP.

Create `.env.local`:

```bash
GMAIL_USER=sapienspay@gmail.com
GMAIL_APP_PASSWORD=your_google_app_password
LEAD_TO_EMAIL=sapienspay@gmail.com
```

Optional:

```bash
LEAD_FROM_EMAIL="Sapiens Pay Leads <sapienspay@gmail.com>"
LEAD_REPLY_TO=sapienspay@gmail.com
```

Notes:
- Enable 2FA on your Google account.
- Generate an App Password in Google Account security settings.
- Use that App Password as `GMAIL_APP_PASSWORD` (not your main account password).
