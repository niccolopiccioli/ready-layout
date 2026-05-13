import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SiteGen — Crea il tuo sito',
  description: 'Piattaforma No-Code per creare siti web professionali.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${hanken.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
