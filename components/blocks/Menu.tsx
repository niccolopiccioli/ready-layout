import { richProps } from '@/lib/richtext'

interface MenuGroup {
  groupName: string
  items: string
}

interface MenuProps {
  sectionTitle: string
  subtext: string
  groups: MenuGroup[]
}

function parseMenuItems(raw: string): { dish: string; price: string }[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(' — ')
      return {
        dish: parts[0]?.trim() ?? line,
        price: parts[1]?.trim() ?? '',
      }
    })
}

export function Menu({ sectionTitle, subtext, groups }: MenuProps) {
  return (
    <section className="py-20 md:py-28 bg-stone-50">
      <div className="max-w-5xl mx-auto px-6">
        {sectionTitle && (
          <h2 data-field="sectionTitle" data-field-type="text" className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 mb-3" {...richProps(sectionTitle)} />
        )}
        {subtext && (
          <p data-field="subtext" data-field-type="text" className="text-base text-stone-500 mb-12 md:mb-16 leading-relaxed max-w-[55ch]" {...richProps(subtext)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {groups.map((group, gi) => {
            const parsed = parseMenuItems(group.items)
            return (
              <div key={gi}>
                <h3 data-field={`groups.${gi}.groupName`} data-field-type="text" className="text-sm font-medium tracking-tight letter-spacing-tight text-stone-900 uppercase tracking-wide mb-6 pb-3 border-b border-stone-200" {...richProps(group.groupName)} />
                <ul className="flex flex-col gap-4">
                  {parsed.map((item, ii) => (
                    <li key={ii} className="flex items-baseline gap-2">
                      <span className="text-base text-stone-800 font-normal shrink-0">
                        {item.dish}
                      </span>
                      <span className="flex-1 border-b border-dotted border-stone-300 mb-[3px]" />
                      {item.price && (
                        <span className="text-sm font-medium text-stone-600 shrink-0">
                          {item.price}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}