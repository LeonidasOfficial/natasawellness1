# Supabase Setup

## 1. Run the database migration

**Option A: Using DATABASE_URL (recommended)**

1. Get your database URL: Supabase Dashboard > Settings > Database > Connection string (URI)
2. Add to `.env.local`: `DATABASE_URL=postgresql://postgres.[ref]:[password]@...`
3. Run: `npm run migrate:supabase-sql`

**Option B: Manual**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project > **SQL Editor**
3. Copy the contents of `migrations/001_initial_schema.sql`
4. Paste and click **Run**

## 2. Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `images`
4. Enable **Public bucket** (so image URLs work)
5. Click **Create bucket**

## 3. Migrate existing data

From the project root, run:

```bash
node scripts/migrate-to-supabase.mjs
```

This uploads images from `public/img/` to Supabase Storage and inserts metadata into the database. Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set.
