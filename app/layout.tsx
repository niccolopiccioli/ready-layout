import type { Metadata } from 'next'
import { 
  Hanken_Grotesk,
  Geist_Mono,
  Playfair_Display,
  Cormorant,
  Lora,
  Outfit,
  Plus_Jakarta_Sans,
  DM_Sans,
  Manrope,
  Space_Grotesk,
  Syne,
  Work_Sans,
  Sora,
  Rubik,
  Inter,
  Bebas_Neue,
  Oswald,
  Righteous,
  JetBrains_Mono,
} from 'next/font/google'
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

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const cormorant = Cormorant({ subsets: ['latin'], variable: '--font-cormorant', display: 'swap' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap' })

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-work-sans', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })
const rubik = Rubik({ subsets: ['latin'], variable: '--font-rubik', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas-neue' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', display: 'swap' })
const righteous = Righteous({ subsets: ['latin'], weight: '400', variable: '--font-righteous' })

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata: Metadata = {
  title: 'ReadyLayout — Crea il tuo sito',
  description: 'Piattaforma No-Code per creare siti web professionali.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`
        ${hanken.variable} ${geistMono.variable} 
        ${playfair.variable} ${cormorant.variable} ${lora.variable}
        ${outfit.variable} ${plusJakarta.variable} ${dmSans.variable} ${manrope.variable} ${spaceGrotesk.variable} ${syne.variable} ${workSans.variable} ${sora.variable} ${rubik.variable} ${inter.variable}
        ${bebasNeue.variable ?? ''} ${oswald.variable} ${righteous.variable ?? ''}
        ${jetbrainsMono.variable}
        antialiased
      `}>
        {children}
      </body>
    </html>
  )
}