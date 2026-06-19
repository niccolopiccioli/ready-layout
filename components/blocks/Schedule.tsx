import { richProps } from '@/lib/richtext'

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
            <h2 data-field="sectionTitle" data-field-type="text" className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-2" {...richProps(sectionTitle)} />
          )}
          {date && (
            <p data-field="date" data-field-type="text" className="text-sm font-medium text-slate-400 tracking-wide" {...richProps(date)} />
          )}
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-0">
          {items.map((item, i) => (
            <div key={i} className="flex gap-6 md:gap-8">
              {/* Time */}
              <div className="w-20 md:w-24 flex-shrink-0 pt-0.5">
                <span data-field={`items.${i}.time`} data-field-type="text" className="text-sm font-mono text-slate-500 tabular-nums" {...richProps(item.time)} />
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
                <h3 data-field={`items.${i}.title`} data-field-type="text" className="text-base font-semibold text-slate-900 leading-snug mb-1" {...richProps(item.title)} />
                {item.speaker && (
                  <p data-field={`items.${i}.speaker`} data-field-type="text" className="text-sm text-slate-600 mb-0.5" {...richProps(item.speaker)} />
                )}
                {item.location && (
                  <p data-field={`items.${i}.location`} data-field-type="text" className="text-xs text-slate-400 italic" {...richProps(item.location)} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}