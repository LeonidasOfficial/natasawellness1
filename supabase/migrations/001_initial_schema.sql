-- Images table: stores image metadata
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  storage_path TEXT,
  category TEXT NOT NULL,
  location TEXT,
  description TEXT,
  current_file TEXT NOT NULL,
  type TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by TEXT DEFAULT 'admin'
);

-- Gallery table: stores gallery items
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  storage_path TEXT,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Public read access for images
CREATE POLICY "Allow public read on images" ON images
  FOR SELECT USING (true);

-- Public read access for gallery
CREATE POLICY "Allow public read on gallery" ON gallery
  FOR SELECT USING (true);

-- Writes use service_role key in API (bypasses RLS)
