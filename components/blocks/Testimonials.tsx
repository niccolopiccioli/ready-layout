import { richProps } from '@/lib/richtext'

interface TestimonialItem {
  quote: string
  author: string
  role: string
  avatar: string
}

interface TestimonialsProps {
  sectionTitle: string
  items: TestimonialItem[]
}

export function Testimonials({ sectionTitle, items }: TestimonialsProps) {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {sectionTitle && (
          <h2 data-field="sectionTitle" data-field-type="text" className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-10 md:mb-14" {...richProps(sectionTitle)} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col bg-white rounded-sm p-8 border border-slate-100"
            >
              {/* Opening quote glyph */}
              <span
                className="text-5xl leading-none text-slate-200 font-serif mb-4 select-none"
                aria-hidden="true"
              >
                ❝
              </span>

              {/* Quote */}
              <p data-field={`items.${i}.quote`} data-field-type="text" className="text-base font-medium text-slate-800 leading-relaxed flex-1 mb-6" {...richProps(item.quote)} />

              {/* Divider */}
              <div className="border-t border-slate-100 mb-6" />

              {/* Author */}
              <div className="flex items-center gap-3">
                {item.avatar && (
                  <img
                    data-field={`items.${i}.avatar`}
                    data-field-type="image"
                    src={item.avatar}
                    alt={item.author}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <p data-field={`items.${i}.author`} data-field-type="text" className="text-sm font-semibold text-slate-900 leading-tight" {...richProps(item.author)} />
                  {item.role && (
                    <p data-field={`items.${i}.role`} data-field-type="text" className="text-xs text-slate-400 mt-0.5" {...richProps(item.role)} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}