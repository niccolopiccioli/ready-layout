import { richProps } from '@/lib/richtext'

interface TextBlockProps {
  eyebrow: string
  heading: string
  body: string
  alignment: string
}

export function TextBlock({ eyebrow, heading, body, alignment }: TextBlockProps) {
  const isCenter = alignment === 'center'

  return (
    <section className="py-20 md:py-28 bg-white">
      <div
        className={`max-w-4xl mx-auto px-6 ${isCenter ? 'text-center' : 'text-left'}`}
      >
        {eyebrow && (
          <p data-field="eyebrow" data-field-type="text" className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-5" {...richProps(eyebrow)} />
        )}

        {heading && (
          <h2 data-field="heading" data-field-type="text" className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-[1.15] mb-6" {...richProps(heading)} />
        )}

        {body && (
          <p
            data-field="body"
            data-field-type="text"
            className={`text-base md:text-lg text-slate-600 leading-relaxed max-w-prose ${isCenter ? 'mx-auto' : ''}`}
            {...richProps(body)}
          />
        )}
      </div>
    </section>
  )
}