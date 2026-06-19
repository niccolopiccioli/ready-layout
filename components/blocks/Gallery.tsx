'use client'

import { DraggableItem } from '@/components/editor/drag/DraggableItem'
import { richProps } from '@/lib/richtext'

interface GalleryItem {
  image: string
  caption: string
}

interface GalleryProps {
  sectionTitle: string
  layout: string
  items: GalleryItem[]
  _sectionId: string
}

export function Gallery({ sectionTitle, layout, items, _sectionId }: GalleryProps) {
  const isMasonry = layout === 'masonry'
  const isTwoCol = layout === 'two-col'

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {sectionTitle && (
          <h2 data-field="sectionTitle" data-field-type="text" className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-10 md:mb-14" {...richProps(sectionTitle)} />
        )}

        {isMasonry && (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {items.map((item, i) => (
              <DraggableItem key={i} sectionId={_sectionId} fieldId="items" itemIndex={i}>
                <div key={i} className="break-inside-avoid group cursor-grab">
                  <div className="overflow-hidden rounded-sm">
                    <img
                      data-field={`items.${i}.image`}
                      data-field-type="image"
                      src={item.image}
                      alt={item.caption}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  {item.caption && (
                    <p data-field={`items.${i}.caption`} data-field-type="text" className="mt-2 text-xs text-slate-500 leading-snug" {...richProps(item.caption)} />
                  )}
                </div>
              </DraggableItem>
            ))}
          </div>
        )}

        {isTwoCol && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => (
              <DraggableItem key={i} sectionId={_sectionId} fieldId="items" itemIndex={i}>
                <div key={i} className="group cursor-grab">
                  <div className="overflow-hidden rounded-sm">
                    <img
                      data-field={`items.${i}.image`}
                      data-field-type="image"
                      src={item.image}
                      alt={item.caption}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  {item.caption && (
                    <p data-field={`items.${i}.caption`} data-field-type="text" className="mt-2 text-xs text-slate-500 leading-snug" {...richProps(item.caption)} />
                  )}
                </div>
              </DraggableItem>
            ))}
          </div>
        )}

        {!isMasonry && !isTwoCol && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <DraggableItem key={i} sectionId={_sectionId} fieldId="items" itemIndex={i}>
                <div key={i} className="group cursor-grab">
                  <div className="overflow-hidden rounded-sm">
                    <img
                      data-field={`items.${i}.image`}
                      data-field-type="image"
                      src={item.image}
                      alt={item.caption}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  {item.caption && (
                    <p data-field={`items.${i}.caption`} data-field-type="text" className="mt-2 text-xs text-slate-500 leading-snug" {...richProps(item.caption)} />
                  )}
                </div>
              </DraggableItem>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}