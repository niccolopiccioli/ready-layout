interface GalleryItem {
  image: string
  caption: string
}

interface GalleryProps {
  sectionTitle: string
  layout: string
  items: GalleryItem[]
}

export function Gallery({ sectionTitle, layout, items }: GalleryProps) {
  const isMasonry = layout === 'masonry'
  const isTwoCol = layout === 'two-col'

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {sectionTitle && (
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-10 md:mb-14">
            {sectionTitle}
          </h2>
        )}

        {isMasonry && (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {items.map((item, i) => (
              <div key={i} className="break-inside-avoid group">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                {item.caption && (
                  <p className="mt-2 text-xs text-slate-500 leading-snug">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {isTwoCol && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => (
              <div key={i} className="group">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                {item.caption && (
                  <p className="mt-2 text-xs text-slate-500 leading-snug">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!isMasonry && !isTwoCol && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <div key={i} className="group">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                {item.caption && (
                  <p className="mt-2 text-xs text-slate-500 leading-snug">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
