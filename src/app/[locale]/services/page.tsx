// NOTE: Services page is currently disabled/hidden from navigation
// To re-enable: Uncomment the services link in Navbar.tsx and restore the original page content below
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocaleLink } from '@/hooks/useLocaleLink'

export default function ServicesPage() {
  const router = useRouter()
  const { createLink } = useLocaleLink()
  const home = createLink('/')

  useEffect(() => {
    // Redirect to homepage since services page is disabled
    router.replace(home)
  }, [router, home])

  return null
}

