import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import FloatingSocialButtons from '@/components/ui/FloatingBookButton'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import LocaleSetter from '@/components/LocaleSetter'
import PageTransition from '@/components/ui/PageTransition'

const locales = ['en', 'sr', 'fr', 'de']

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(params.locale)) {
    notFound()
  }

  return (
    <>
      <LocaleSetter />
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      <ScrollToTop />
      <FloatingSocialButtons />
      <WhatsAppButton />
    </>
  )
}

