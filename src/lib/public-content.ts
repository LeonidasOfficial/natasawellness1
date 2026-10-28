import { readContent } from '@/lib/content-store'
import { isPriceList, type PriceListCategory } from '@/lib/pricelist-display'

/**
 * Server-side readers for content that is editable in the admin panel.
 * They read the same store the admin API writes to (Supabase `site_content`,
 * or local JSON files when Supabase is not configured) and never throw:
 * on any failure they return null so callers can fall back to bundled data.
 */

export async function getStoredPriceList(): Promise<PriceListCategory[] | null> {
  try {
    const data = await readContent<unknown>('price-list')
    return isPriceList(data) ? data : null
  } catch (error) {
    console.error('[public-content] Failed to read price list:', error)
    return null
  }
}

export async function getStoredPromotions(): Promise<Record<string, unknown> | null> {
  try {
    const data = await readContent<unknown>('promotions')
    return data && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null
  } catch (error) {
    console.error('[public-content] Failed to read promotions:', error)
    return null
  }
}
