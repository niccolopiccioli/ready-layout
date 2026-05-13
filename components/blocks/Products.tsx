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
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-10 md:mb-14">
            {sectionTitle}
          </h2>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Image container */}
              <div className="relative overflow-hidden rounded-sm mb-3 aspect-square bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {item.tag && (
                  <span className="absolute top-2 right-2 text-xs font-medium tracking-wide px-2 py-0.5 bg-white text-slate-700 rounded-sm">
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Info */}
              <p className="text-sm font-medium text-slate-900 leading-snug mb-1">
                {item.name}
              </p>
              {item.price && (
                <p className="text-sm font-semibold text-slate-500">
                  {item.price}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
