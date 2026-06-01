# Supabase Setup (Vercel production)

Supabase is used for persistent storage on Vercel (read-only filesystem). This includes:

- **Images & gallery** – Supabase Storage + `images` / `gallery` tables
- **Price list, promotions, translations** – `site_content` table (JSON blobs)

## Quick setup

### Step 1: Run the SQL migration (creates tables)

**Option A** – Using DATABASE_URL:
1. Supabase Dashboard > Settings > Database > Connection string (URI)
2. Copy the URI (replace `[YOUR-PASSWORD]` with your database password)
3. Add to `.env.local`: `DATABASE_URL=postgresql://postgres.[ref]:[password]@...`
4. Run: `npm run migrate:supabase-sql`

**Option B** – Manual (no password needed):
1. Open https://supabase.com/dashboard/project/jjlaajwggyyaoxdygdau/sql/new
2. Copy and run each file in `supabase/migrations/` (001, then 002)
3. Or paste both SQL files in order and click **Run**

### Step 2: Seed CMS content (price list, promotions, translations)

Run: `npm run seed:site-content`

This copies your current JSON files into the `site_content` table so the admin panel and frontend use the same data on Vercel.

### Step 3: Migrate images (uploads images, inserts metadata)

Run: `npm run migrate:supabase`

### Step 4: Add Vercel environment variables

In Vercel: Project > Settings > Environment Variables, add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jjlaajwggyyaoxdygdau.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |

Then redeploy.

## Environment variables

In `.env.local` (and Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Optional (for SQL migration script):
```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

## Note on keys

The Supabase service role key may be in two formats:
- Legacy: `eyJ...` (JWT)
- New: `sb_secret_...`

Both work with `@supabase/supabase-js`. If you have issues, use the **anon** and **service_role** keys from the "Project API keys" section in Supabase Dashboard > Settings > API.
