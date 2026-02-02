/**
 * Run the Supabase SQL migration (creates tables).
 * Requires: DATABASE_URL in .env.local
 * Get it from: Supabase Dashboard > Settings > Database > Connection string (URI)
 * Format: postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
 */
import pg from 'pg'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

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

async function main() {
  await loadEnv()
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('Missing DATABASE_URL. Add it to .env.local')
    console.error('Get it from: Supabase Dashboard > Settings > Database > Connection string (URI)')
    process.exit(1)
  }

  const sql = await readFile(join(root, 'supabase', 'migrations', '001_initial_schema.sql'), 'utf-8')
  const client = new pg.Client({ connectionString: dbUrl })
  await client.connect()
  try {
    await client.query(sql)
    console.log('SQL migration completed.')
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
