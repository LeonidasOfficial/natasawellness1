-- CMS content stored as JSON (price list, promotions, translations, etc.)
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on site_content" ON site_content
  FOR SELECT USING (true);

-- Writes use service_role key in API routes (bypasses RLS)
