interface ScheduleItem {
  time: string
  title: string
  speaker: string
  location: string
}

interface ScheduleProps {
  sectionTitle: string
  date: string
  items: ScheduleItem[]
}

export function Schedule({ sectionTitle, date, items }: ScheduleProps) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          {sectionTitle && (
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
              {sectionTitle}
            </h2>
          )}
          {date && (
            <p className="text-sm font-medium text-slate-400 tracking-wide">{date}</p>
          )}
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-0">
          {items.map((item, i) => (
            <div key={i} className="flex gap-6 md:gap-8">
              {/* Time */}
              <div className="w-20 md:w-24 flex-shrink-0 pt-0.5">
                <span className="text-sm font-mono text-slate-500 tabular-nums">
                  {item.time}
                </span>
              </div>

              {/* Vertical line + dot */}
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                {i < items.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 my-1" style={{ minHeight: '3rem' }} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${i < items.length - 1 ? 'pb-10' : 'pb-2'}`}>
                <h3 className="text-base font-semibold text-slate-900 leading-snug mb-1">
                  {item.title}
                </h3>
                {item.speaker && (
                  <p className="text-sm text-slate-600 mb-0.5">{item.speaker}</p>
                )}
                {item.location && (
                  <p className="text-xs text-slate-400 italic">{item.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
