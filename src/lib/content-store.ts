import fs from 'fs/promises'
import path from 'path'
import { createSupabaseAdmin } from '@/lib/supabase'

export function isSupabaseContentStoreEnabled(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function getFilePaths(key: string): string[] {
  if (key.startsWith('translations:')) {
    const locale = key.split(':')[1]
    return [
      path.join(process.cwd(), 'public', 'locales', `${locale}.json`),
      path.join(process.cwd(), 'src', 'locales', `${locale}.json`),
    ]
  }

  const filename = `${key}.json`
  return [path.join(process.cwd(), 'src', 'data', filename)]
}

async function readFromFiles<T>(key: string): Promise<T | null> {
  const paths = getFilePaths(key)
  for (const filePath of paths) {
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(raw) as T
    } catch {
      // try next path
    }
  }
  return null
}

async function writeToFiles<T>(key: string, data: T): Promise<void> {
  const paths = getFilePaths(key)
  const payload = JSON.stringify(data, null, 2)
  let lastError: unknown

  for (const filePath of paths) {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, payload, 'utf-8')
    } catch (error) {
      lastError = error
    }
  }

  if (lastError) {
    throw lastError
  }
}

export async function readContent<T>(key: string): Promise<T | null> {
  if (isSupabaseContentStoreEnabled()) {
    try {
      const supabase = createSupabaseAdmin()
      const { data: row, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', key)
        .maybeSingle()

      if (!error && row?.data != null) {
        return row.data as T
      }
    } catch (error) {
      console.error(`[content-store] Supabase read failed for "${key}":`, error)
    }
  }

  return readFromFiles<T>(key)
}

export async function writeContent<T>(key: string, data: T): Promise<void> {
  if (isSupabaseContentStoreEnabled()) {
    const supabase = createSupabaseAdmin()
    const { error } = await supabase.from('site_content').upsert(
      {
        key,
        data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )

    if (error) {
      console.error(`[content-store] Supabase write failed for "${key}":`, error)
      throw error
    }
    return
  }

  await writeToFiles(key, data)
}
