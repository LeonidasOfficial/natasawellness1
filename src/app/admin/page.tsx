'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthAndRedirect = async () => {
      try {
        const res = await fetch('/api/auth/verify')
        if (res.ok) {
          // User is authenticated, redirect to dashboard
          router.push('/admin/dashboard')
        } else {
          // User is not authenticated, redirect to login
          router.push('/admin/login')
        }
      } catch (error) {
        // On error, redirect to login
        router.push('/admin/login')
      }
    }

    checkAuthAndRedirect()
  }, [router])

  return <LoadingSpinner fullScreen />
}
