import { richProps } from '@/lib/richtext'

interface ProductItem {
  image: string
  name: string
  price: string
  tag: string
}

interface ProductsProps {
  sectionTitle: string
  items: ProductItem[]
}

export function Products({ sectionTitle, items }: ProductsProps) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {sectionTitle && (
          <h2 data-field="sectionTitle" data-field-type="text" className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-10 md:mb-14" {...richProps(sectionTitle)} />
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Image container */}
              <div className="relative overflow-hidden rounded-sm mb-3 aspect-square bg-slate-100">
                <img
                  data-field={`items.${i}.image`}
                  data-field-type="image"
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {item.tag && (
                  <span data-field={`items.${i}.tag`} data-field-type="text" className="absolute top-2 right-2 text-xs font-medium tracking-wide px-2 py-0.5 bg-white text-slate-700 rounded-sm" {...richProps(item.tag)} />
                )}
              </div>

              {/* Info */}
              <p data-field={`items.${i}.name`} data-field-type="text" className="text-sm font-medium text-slate-900 leading-snug mb-1" {...richProps(item.name)} />
              {item.price && (
                <p data-field={`items.${i}.price`} data-field-type="text" className="text-sm font-semibold text-slate-500" {...richProps(item.price)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}