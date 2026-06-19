import { richProps } from '@/lib/richtext'

interface StatItem {
  value: string
  label: string
}

interface StatsProps {
  items: StatItem[]
  bgColor: string
  textColor: string
}

export function Stats({ items, bgColor, textColor }: StatsProps) {
  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-current/10">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-center py-10 sm:py-6 sm:px-8 text-center"
            >
              <span data-field={`items.${i}.value`} data-field-type="text" className="text-5xl md:text-6xl font-medium tracking-tight leading-none mb-3" {...richProps(item.value)} />
              <span data-field={`items.${i}.label`} data-field-type="text" className="text-xs font-semibold tracking-widest uppercase opacity-50" {...richProps(item.label)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}