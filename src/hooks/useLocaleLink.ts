'use client'

import { usePathname } from 'next/navigation'

export function useLocaleLink() {
  const pathname = usePathname()
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en'
  
  // Function to create locale-aware links
  const createLink = (path: string) => {
    // If path already starts with locale, return as is
    if (path.match(/^\/(en|fr|de|sr)\//)) {
      return path
    }
    
    // Add current locale to path
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const localizedPath = cleanPath === '/' ? '' : cleanPath
    return `/${currentLocale}${localizedPath}`
  }
  
  return { createLink, currentLocale }
}
