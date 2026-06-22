<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Infrastructure

This project is already wired up end-to-end — do not re-run setup, just use what's here.

- **GitHub**: https://github.com/meitalgro2/joobi (public). Remote `origin` already set on `master`. Pushing to `master` triggers an automatic Vercel deploy.
- **Vercel**: project `joobi` under team `meitalgro-s-projects`. Production domain: https://joobi-sand.vercel.app. CLI binary: `C:\Users\meita\AppData\Roaming\npm\vercel` (the `.ps1`/`.cmd` shims hang under PowerShell — invoke the path above directly, ideally from Bash). Env vars (DATABASE_URL, DIRECT_URL, AUTH_SECRET, GOOGLE_CLIENT_ID/SECRET, RESEND_API_KEY, EMAIL_FROM, APP_URL, AUTH_URL) are already set in the Vercel production environment — check with `vercel env ls production`, don't recreate them.
- **Database**: Supabase Postgres, project ref `biovzuhfiobjtwzghzqz`, region `eu-central-1` (org `mfwdzwcwjtydzjwhspwz`). Prisma `datasource db` uses `provider = "postgresql"` with `url = env("DATABASE_URL")` (transaction pooler, port 6543) and `directUrl = env("DIRECT_URL")` (session pooler, port 5432) — both via `aws-1-eu-central-1.pooler.supabase.com`, not the direct `db.<ref>.supabase.co` host. CLI binary: `C:\Users\meita\AppData\Roaming\npm\supabase.exe`.
- **Auth**: NextAuth/Auth.js v5 (`src/auth.ts`), Google provider callback is `/api/auth/callback/google`. That exact URL (with the `/api/auth/callback/google` suffix) must be in the Google Cloud OAuth Client's "Authorised redirect URIs" — already added for the production domain above.
- Local `.env` holds real secrets and is gitignored — never commit it. To change a production secret, update it via `vercel env` (rm + add), not by editing `.env` alone.
