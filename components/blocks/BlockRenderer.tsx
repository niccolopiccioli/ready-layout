import type { BlockType } from '@/lib/schemas/types'
import { Hero } from './Hero'
import { Features } from './Features'
import { Pricing } from './Pricing'
import { FAQ } from './FAQ'
import { CTA } from './CTA'
import { About } from './About'
import { Gallery } from './Gallery'
import { Articles } from './Articles'
import { ContactForm } from './ContactForm'
import { LinkList } from './LinkList'
import { Menu } from './Menu'
import { Products } from './Products'
import { Testimonials } from './Testimonials'
import { Stats } from './Stats'
import { Schedule } from './Schedule'
import { TextBlock } from './TextBlock'

type AnyProps = Record<string, unknown>

const registry: Record<BlockType, (props: AnyProps) => React.ReactElement> = {
  hero: Hero as unknown as (props: AnyProps) => React.ReactElement,
  features: Features as unknown as (props: AnyProps) => React.ReactElement,
  pricing: Pricing as unknown as (props: AnyProps) => React.ReactElement,
  faq: FAQ as unknown as (props: AnyProps) => React.ReactElement,
  cta: CTA as unknown as (props: AnyProps) => React.ReactElement,
  about: About as unknown as (props: AnyProps) => React.ReactElement,
  gallery: Gallery as unknown as (props: AnyProps) => React.ReactElement,
  articles: Articles as unknown as (props: AnyProps) => React.ReactElement,
  contact: ContactForm as unknown as (props: AnyProps) => React.ReactElement,
  linklist: LinkList as unknown as (props: AnyProps) => React.ReactElement,
  menu: Menu as unknown as (props: AnyProps) => React.ReactElement,
  products: Products as unknown as (props: AnyProps) => React.ReactElement,
  testimonials: Testimonials as unknown as (props: AnyProps) => React.ReactElement,
  stats: Stats as unknown as (props: AnyProps) => React.ReactElement,
  schedule: Schedule as unknown as (props: AnyProps) => React.ReactElement,
  textblock: TextBlock as unknown as (props: AnyProps) => React.ReactElement,
}

interface BlockRendererProps {
  blockType: BlockType
  values: Record<string, unknown>
}

export function BlockRenderer({ blockType, values }: BlockRendererProps) {
  const Block = registry[blockType]
  if (!Block) return null
  return <Block {...values} />
}
