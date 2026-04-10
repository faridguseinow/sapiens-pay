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

## Lead form Google Sheets setup (optional)

Leads can also be appended to Google Sheets in parallel with email.

Add to `.env.local`:

```bash
GOOGLE_SHEETS_CLIENT_EMAIL=service-account-name@project-id.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_SHEET_NAME=Leads
```

Google setup:
- Create a Google Cloud service account and enable **Google Sheets API**.
- Share your Google Sheet with the service account email (`Editor` access).
- Put the sheet ID from the URL into `GOOGLE_SHEETS_SPREADSHEET_ID`.

The API appends columns in this order:
`submitted_at_iso`, `locale`, `name`, `phone`, `preferred_contact`, `estimated_yearly_loss_azn`, `business_type`, `ad_budget_usd`, `monthly_commission_usd`, `growth_plan`, `answers`.
