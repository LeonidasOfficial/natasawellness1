/**
 * Migrate images and gallery data from JSON files to Supabase.
 * Run: node scripts/migrate-to-supabase.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local or environment
 */
import { createClient } from '@supabase/supabase-js'
import { readFile, readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const imgDir = join(root, 'public', 'img')

let supabase

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

async function uploadFile(filePath, storagePath) {
  const { createReadStream } = await import('fs')
  const stream = createReadStream(filePath)
  const buffer = await new Promise((res, rej) => {
    const chunks = []
    stream.on('data', (c) => chunks.push(c))
    stream.on('end', () => res(Buffer.concat(chunks)))
    stream.on('error', rej)
  })
  const { error } = await supabase.storage.from('images').upload(storagePath, buffer, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('images').getPublicUrl(storagePath)
  return data.publicUrl
}

async function main() {
  await loadEnv()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  supabase = createClient(supabaseUrl, supabaseKey)

  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.some((b) => b.name === 'images')) {
    console.log('Creating images bucket...')
    const { error: bucketErr } = await supabase.storage.createBucket('images', { public: true })
    if (bucketErr) {
      console.error('Failed to create bucket:', bucketErr)
      process.exit(1)
    }
    console.log('Bucket created.')
  }

  const imagesJson = JSON.parse(
    await readFile(join(root, 'src', 'data', 'images.json'), 'utf-8')
  )
  const galleryJson = JSON.parse(
    await readFile(join(root, 'src', 'data', 'gallery.json'), 'utf-8')
  )

  const urlMap = {}

  for (const img of imagesJson) {
    const currentFile = img.currentFile || img.path?.replace('/img/', '')
    if (!currentFile) continue
    const localPath = join(imgDir, currentFile)
    try {
      await import('fs').then((fs) => fs.promises.access(localPath))
    } catch {
      console.warn('Skip (file not found):', currentFile)
      continue
    }
    const storagePath = `images/${currentFile}`
    console.log('Uploading', currentFile)
    const publicUrl = await uploadFile(localPath, storagePath)
    urlMap[currentFile] = publicUrl
  }

  const imagesRows = imagesJson.map((img) => {
    const currentFile = img.currentFile || img.path?.replace('/img/', '')
    const publicUrl = urlMap[currentFile] || img.path
    return {
      id: img.id,
      path: publicUrl,
      storage_path: currentFile ? `images/${currentFile}` : null,
      category: img.category,
      location: img.location || '',
      description: img.description || '',
      current_file: currentFile || img.id,
      type: img.type || 'content',
      last_updated: img.lastUpdated || new Date().toISOString(),
      uploaded_by: img.uploadedBy || 'admin',
    }
  })

  const { error: imgErr } = await supabase.from('images').upsert(imagesRows, { onConflict: 'id' })
  if (imgErr) {
    if (imgErr.code === 'PGRST205' || imgErr.message?.includes('schema cache')) {
      console.error('\nTables not found. Run the SQL migration first:')
      console.error('1. Go to Supabase Dashboard > SQL Editor')
      console.error('2. Run the SQL from supabase/migrations/001_initial_schema.sql')
      console.error('\nThen run this script again.')
    } else {
      console.error('Images insert error:', imgErr)
    }
    process.exit(1)
  }
  console.log('Inserted', imagesRows.length, 'images')

  const galleryRows = galleryJson.map((item) => {
    const imgPath = item.image || ''
    const fileName = imgPath.replace('/img/', '')
    const publicUrl = urlMap[fileName] || imgPath
    return {
      title: item.title,
      category: item.category || 'facial',
      image: publicUrl,
      storage_path: fileName ? `images/${fileName}` : null,
      featured: item.featured !== false,
    }
  })

  const { error: galErr } = await supabase.from('gallery').insert(galleryRows)
  if (galErr) {
    console.error('Gallery insert error:', galErr)
    process.exit(1)
  }
  console.log('Inserted', galleryRows.length, 'gallery items')
  console.log('Migration complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
