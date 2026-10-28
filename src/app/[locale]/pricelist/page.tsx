import PriceListClient from '@/components/pricelist/PriceListClient'
import { getStoredPriceList } from '@/lib/public-content'

// Always render on request so admin-panel edits show up immediately.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PriceListPage() {
  const priceList = await getStoredPriceList()
  return <PriceListClient initialPriceList={priceList} />
}
