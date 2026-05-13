interface ArticleItem {
  title: string
  excerpt: string
  date: string
  image: string
  tag: string
}

interface ArticlesProps {
  sectionTitle: string
  items: ArticleItem[]
}

export function Articles({ sectionTitle, items }: ArticlesProps) {
  const featured = items[0]
  const rest = items.slice(1)

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {sectionTitle && (
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-10 md:mb-14">
            {sectionTitle}
          </h2>
        )}

        {/* Featured article */}
        {featured && (
          <div className="group cursor-pointer mb-12 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="overflow-hidden rounded-sm">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full aspect-[3/2] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div>
                {featured.tag && (
                  <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
                    {featured.tag}
                  </p>
                )}
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 leading-[1.2] mb-4 group-hover:text-slate-600 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed mb-6 max-w-[60ch]">
                  {featured.excerpt}
                </p>
                <time className="text-xs text-slate-400 tracking-wide">{featured.date}</time>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        {rest.length > 0 && (
          <div className="border-t border-slate-100 mb-12" />
        )}

        {/* Rest of articles — 3 column grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {rest.map((item, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="overflow-hidden rounded-sm mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-[3/2] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                {item.tag && (
                  <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                    {item.tag}
                  </p>
                )}
                <h4 className="text-base font-semibold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-slate-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
                  {item.excerpt}
                </p>
                <time className="text-xs text-slate-400 tracking-wide">{item.date}</time>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
