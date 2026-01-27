import type { Metadata } from 'next'
import { Work_Sans, Dancing_Script, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { TranslationProvider } from '@/contexts/TranslationContext'

const workSans = Work_Sans({ 
  subsets: ['latin'],
  variable: '--font-worksans',
  weight: ['300', '400', '500', '600', '700']
})

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing',
  weight: ['400', '500', '600', '700']
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Nataša Wellness - Kozmetika i Wellness | Velika Plana',
  description: 'Nataša Wellness - Profesionalni tretmani lica, manikir, pedikir, podizanje trepavica, epilacija i wellness usluge u Velikoj Plani. Pozovite 063 1020 305.',
  keywords: 'kozmetika, wellness, tretman lica, manikir, pedikir, epilacija, podizanje trepavica, spa, Velika Plana',
  authors: [{ name: 'Nataša Wellness' }],
  openGraph: {
    title: 'Nataša Wellness - Kozmetika i Wellness',
    description: 'Profesionalni kozmetički i wellness tretmani u Velikoj Plani',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${workSans.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}>
      <body className="custom-scrollbar">
        <TranslationProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#D4A574',
                border: '2px solid #D4A574',
              },
              success: {
                iconTheme: {
                  primary: '#D4A574',
                  secondary: '#1A1A1A',
                },
              },
            }}
          />
        </TranslationProvider>
      </body>
    </html>
  )
}

