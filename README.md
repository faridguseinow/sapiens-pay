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

## Admin panel

The Sapiens Pay admin panel is available at:

```text
http://localhost:3000/admin
```

It includes:

- Lead management with status, follow-up date, and internal notes
- Blog post management in Azerbaijani, Russian, and English
- Supabase Auth-managed private team access
- Supabase Storage image uploads

Create a Supabase project, run
`supabase/migrations/202607020001_initial_admin.sql` in the SQL Editor, then add
the project credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Telegram notifications and scheduled follow-up reminders use server-only
environment variables:

```bash
TELEGRAM_BOT_TOKEN=your_botfather_token
TELEGRAM_CHAT_ID=your_chat_or_group_id
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key
CRON_SECRET=a_long_random_secret
```

Never prefix these values with `NEXT_PUBLIC_`. The included Vercel cron calls
`/api/cron/follow-ups` every 15 minutes. On another hosting provider, configure
an equivalent scheduler that sends `Authorization: Bearer $CRON_SECRET`.

Create admin accounts from Supabase Dashboard → Authentication → Users. There is
intentionally no public sign-up page.

## Lead form

The lead quiz submits data to `POST /api/lead`. Leads are stored only in
Supabase and managed from the private admin panel.
