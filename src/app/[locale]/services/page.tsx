// NOTE: Services page is currently disabled/hidden from navigation
// To re-enable: Uncomment the services link in Navbar.tsx and restore the original page content below
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ServicesPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to homepage since services page is disabled
    router.push('/')
  }, [router])

  return null
}

