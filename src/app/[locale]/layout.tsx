import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import FloatingSocialButtons from '@/components/ui/FloatingBookButton'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import LocaleSetter from '@/components/LocaleSetter'
import PageTransition from '@/components/ui/PageTransition'
import LocaleProvider from '@/components/LocaleProvider'

const locales = ['en', 'sr', 'fr', 'de']

const META: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; ogLocale: string }> = {
  sr: {
    title: 'Nataša Wellness - Kozmetika i Wellness | Velika Plana',
    description: 'Nataša Wellness - Profesionalni tretmani lica, manikir, pedikir, podizanje trepavica, depilacija i wellness usluge u Velikoj Plani. Pozovite 063 1020 305.',
    ogTitle: 'Nataša Wellness - Kozmetika i Wellness',
    ogDescription: 'Profesionalni kozmetički i wellness tretmani u Velikoj Plani',
    ogLocale: 'sr_RS',
  },
  en: {
    title: 'Nataša Wellness - Beauty & Wellness | Velika Plana',
    description: 'Nataša Wellness - Professional facials, manicure, pedicure, lash lift, waxing and wellness treatments in Velika Plana. Call 063 1020 305.',
    ogTitle: 'Nataša Wellness - Beauty & Wellness',
    ogDescription: 'Professional beauty and wellness treatments in Velika Plana',
    ogLocale: 'en_GB',
  },
  fr: {
    title: 'Nataša Wellness - Beauté & Bien-être | Velika Plana',
    description: 'Nataša Wellness - Soins du visage, manucure, pédicure, rehaussement des cils, épilation et soins bien-être professionnels à Velika Plana. Appelez le 063 1020 305.',
    ogTitle: 'Nataša Wellness - Beauté & Bien-être',
    ogDescription: 'Soins de beauté et de bien-être professionnels à Velika Plana',
    ogLocale: 'fr_FR',
  },
  de: {
    title: 'Nataša Wellness - Kosmetik & Wellness | Velika Plana',
    description: 'Nataša Wellness - Professionelle Gesichtsbehandlungen, Maniküre, Pediküre, Wimpernlifting, Haarentfernung und Wellness-Behandlungen in Velika Plana. Rufen Sie 063 1020 305 an.',
    ogTitle: 'Nataša Wellness - Kosmetik & Wellness',
    ogDescription: 'Professionelle Kosmetik- und Wellness-Behandlungen in Velika Plana',
    ogLocale: 'de_DE',
  },
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const meta = META[params.locale] ?? META.sr
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      type: 'website',
      locale: meta.ogLocale,
    },
  }
}

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
    <LocaleProvider locale={params.locale}>
      <LocaleSetter />
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      <ScrollToTop />
      <FloatingSocialButtons />
      <WhatsAppButton />
    </LocaleProvider>
  )
}

