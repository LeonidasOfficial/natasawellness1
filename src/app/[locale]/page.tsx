import HomeClient from '@/components/home/HomeClient'
import { getStoredPriceList, getStoredPromotions } from '@/lib/public-content'

// Always render on request so admin-panel edits show up immediately.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const [priceList, promotions] = await Promise.all([
    getStoredPriceList(),
    getStoredPromotions(),
  ])
  return <HomeClient initialPriceList={priceList} initialPromotions={promotions} />
}
