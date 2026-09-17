# JSTU Robotics Club Website

A free-to-run website for the club: public club tour, member directory with
self-editable profiles, a login system for members, a public notice board,
and a membership application form.

**Stack (all free tiers):**
- **Frontend:** React + Vite, hosted on **Vercel** (free)
- **Backend:** **Supabase** — free Postgres database, free Auth (up to 50,000
  monthly active users), free file storage for avatars
- **Total cost: $0**, as long as you stay within free-tier limits (very
  generous for a ~50-person club)

---

## 1. Set up Supabase (10 minutes)

1. Go to [supabase.com](https://supabase.com), sign up free, create a new project.
   Pick any name/region; save the database password it generates somewhere safe.
2. Once the project is ready, go to **SQL Editor** → **New query**.
3. Open `supabase/schema.sql` in this folder, copy **all** of it, paste it into
   the SQL editor, and click **Run**. This creates all three tables
   (profiles, applications, notices), the security rules, and the avatar
   storage bucket.
4. Go to **Settings → API**. You'll need two values from this page:
   - **Project URL**
   - **anon public** key

## 2. Configure the app

1. Copy `.env.example` to `.env.local`:
   ```
   cp .env.example .env.local
   ```
2. Paste your Project URL and anon key into `.env.local`.

## 3. Run it locally

```
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## 4. Make yourself the first admin

1. On the running site, go to **Sign up** and create your own account with
   your real email.
2. Check your email and click the confirmation link (Supabase sends this
   automatically).
3. In Supabase, go to **Table Editor → profiles**, find your row, and set
   `is_admin` to `true`. Save.
4. Log back in — you'll now see **Post a notice** and **Review applications**
   on your dashboard.

From here, you (as admin) can promote other officers the same way — just
flip `is_admin` to `true` on their profile row once they've signed up.

## 5. (Optional) Seed 50 placeholder members

If you want to see the member directory fully populated before real members
sign up:

1. In Supabase, go to **Settings → API** and copy the **service_role** key
   (this is different from the anon key — keep it secret, never put it in
   `.env.local` or commit it anywhere).
2. In your terminal:
   ```
   export SUPABASE_URL=https://your-project-ref.supabase.co
   export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   npm run seed
   ```
3. This creates 50 members with placeholder names, departments, and bios.
   Each one logs in as `member01@jstu-robotics.placeholder` through
   `member50@...`, all with password `ChangeMe123!` — this is only so you
   can preview the site. **Delete these accounts** (Supabase → Authentication)
   once real members start signing up, or leave them and just let real
   members claim their own separate accounts.

## 6. Deploy to Vercel (free)

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign up free, click **New Project**,
   import your GitHub repo.
3. When it asks for environment variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (same values as your `.env.local`)
4. Click **Deploy**. Done — you'll get a free `.vercel.app` URL, and you can
   attach a custom domain later if the club gets one.

---

## What to customize first

- **`src/pages/About.jsx`** — replace the placeholder timeline and project
  descriptions with your club's real history and projects.
- **`src/pages/Home.jsx`** — the hero headline and copy.
- **Colors/fonts** — all design tokens live at the top of `src/index.css`
  (`--accent`, `--bg`, etc.) and in `index.html` (font imports) if you want
  a different look.
- **Notices & members** — these are populated live from your Supabase
  database, not hardcoded, so no code changes needed — just use the
  admin dashboard and member sign-ups.

## How membership + login works

- Anyone can submit the **Join** form — no account needed. It goes straight
  into the `applications` table.
- You (admin) review applications at **/admin/applications** and mark them
  accepted or rejected. This is a manual step by design — accepting an
  application does **not** auto-create their login, since Supabase can't
  safely do that without their password. Tell accepted applicants to go to
  **/signup** with the same email they applied with.
- Signup is currently open to anyone who visits `/signup` — it does not
  check the applications table. For a club of ~50 where you're personally
  vetting members, this is usually fine in practice (you just tell accepted
  people the signup link). If you want it strictly gated later, the natural
  next step is a Supabase Edge Function that checks the applicant's email
  against an `accepted` application before allowing signup — ask if you want
  this built.
- Every signed-up member gets their own row in `profiles` automatically
  (via a database trigger) and can immediately edit their own profile at
  **/dashboard/edit**. Everyone can view all active profiles at **/members**.

## Free-tier limits to know about

- **Supabase free tier:** 500MB database, 1GB file storage, 50,000 monthly
  active users, project pauses after 1 week of no API activity (just visit
  your Supabase dashboard occasionally, or it un-pauses on first request —
  worth knowing before a demo day).
- **Vercel free tier:** 100GB bandwidth/month, unlimited sites — more than
  enough for a club site.

Both are far beyond what ~50 members and public visitors will use.
