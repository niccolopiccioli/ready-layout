interface AboutProps {
  eyebrow: string
  headline: string
  body: string
  image: string
  bgColor: string
  textColor: string
}

export function About({ eyebrow, headline, body, image, bgColor, textColor }: AboutProps) {
  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          {/* Image — top on mobile, left on desktop (35%) */}
          <div className="w-full md:w-[35%] flex-shrink-0">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-sm">
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text — 65% on desktop */}
          <div className="flex-1 flex flex-col justify-center">
            {eyebrow && (
              <p className="text-xs font-semibold tracking-widest uppercase mb-6 opacity-50">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15] mb-8 whitespace-pre-line max-w-xl">
              {headline}
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-75 max-w-[65ch]">
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
