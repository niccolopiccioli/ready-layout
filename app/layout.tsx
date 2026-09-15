import type { Metadata } from 'next'
import {
  Sora,
  Unbounded,
  Chakra_Petch,
  Exo_2,
  Orbitron,
  Share_Tech_Mono,
  Michroma,
  Audiowide,
  Oxanium,
  Saira,
} from 'next/font/google'
import './globals.css'

// ── HERO PINNED — non toccare: serve solo a congelare l'H1 amato (Sora Black) ──
const soraPinned = Sora({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-sora-pinned',
  display: 'swap',
})

// ── NUOVO SISTEMA TIPOGRAFICO — totalmente diverso dal precedente ──
const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  display: 'swap',
})

const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-chakra',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
})

const shareTech = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sharetech',
  display: 'swap',
})

const michroma = Michroma({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-michroma',
  display: 'swap',
})

const audiowide = Audiowide({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-audiowide',
  display: 'swap',
})

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  display: 'swap',
})

const saira = Saira({
  subsets: ['latin'],
  variable: '--font-saira',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ReadyLayout — Crea il tuo sito',
  description: 'Piattaforma No-Code per creare siti web professionali.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body suppressHydrationWarning className={`
        ${soraPinned.variable}
        ${unbounded.variable} ${chakra.variable} ${exo2.variable}
        ${orbitron.variable} ${shareTech.variable} ${michroma.variable}
        ${audiowide.variable} ${oxanium.variable} ${saira.variable}
        antialiased
      `}>
        {children}
      </body>
    </html>
  )
}
