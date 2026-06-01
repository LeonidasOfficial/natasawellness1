/**
 * Seed site_content table from local JSON files (price list, promotions, translations).
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

async function loadEnv() {
  try {
    const envPath = join(root, '.env.local')
    const env = await readFile(envPath, 'utf-8')
    for (const line of env.split('\n')) {
      const [key, ...valParts] = line.split('=')
      if (key && valParts.length) {
        const val = valParts.join('=').trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) process.env[key] = val
      }
    }
  } catch {}
}

async function readJson(path) {
  const raw = await readFile(path, 'utf-8')
  return JSON.parse(raw)
}

async function main() {
  await loadEnv()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const entries = [
    { key: 'price-list', path: join(root, 'src', 'data', 'price-list.json') },
    { key: 'promotions', path: join(root, 'src', 'data', 'promotions.json') },
  ]

  for (const locale of ['en', 'sr', 'fr', 'de']) {
    entries.push({
      key: `translations:${locale}`,
      path: join(root, 'public', 'locales', `${locale}.json`),
    })
  }

  for (const { key, path: filePath } of entries) {
    try {
      const data = await readJson(filePath)
      const { error } = await supabase.from('site_content').upsert(
        { key, data, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      if (error) throw error
      console.log(`Seeded: ${key}`)
    } catch (e) {
      console.warn(`Skipped ${key}:`, e.message || e)
    }
  }

  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
