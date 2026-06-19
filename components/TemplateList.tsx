'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TemplateThumb } from './TemplateThumb'

interface TemplateMeta {
  id: string
  name: string
  description?: string
  category?: string
}

const categoryLabel: Record<string, string> = {
  landing: 'Landing',
  portfolio: 'Portfolio',
  commerce: 'Commerce',
  content: 'Content',
  event: 'Event',
  personal: 'Personal',
}

export function TemplateList({ templates }: { templates: TemplateMeta[] }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    'all',
    ...Array.from(new Set(templates.map((t) => t.category).filter(Boolean) as string[])),
  ]

  const filtered =
    activeCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === activeCategory)

  return (
    <>
      {/* Category filter chips */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {categories.map((cat) => {
          const isActive = cat === activeCategory
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="ed-press px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-[0.06em] uppercase transition-all"
              style={{
                background: isActive ? 'var(--ed-accent-surface)' : 'transparent',
                color: isActive ? 'var(--ed-accent-text)' : 'var(--ed-muted)',
                border: `1px solid ${isActive ? 'var(--ed-accent)' : 'var(--ed-border)'}`,
              }}
            >
              {cat === 'all' ? 'Tutti' : (categoryLabel[cat] ?? cat)}
            </button>
          )
        })}
      </div>

      {/* Card grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((template, i) => (
          <li key={template.id}>
            <Link
              href={`/editor/${template.id}`}
              className="group flex flex-col rounded-xl overflow-hidden transition-shadow hover:shadow-lg"
              style={{ border: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
            >
              <TemplateThumb templateId={template.id} />
              <div className="p-4">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span
                    className="text-[11px] font-mono tabular-nums shrink-0"
                    style={{ color: 'var(--ed-muted)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2
                    className="text-[17px] font-medium tracking-tight leading-tight"
                    style={{ color: 'var(--ed-text)' }}
                  >
                    {template.name}
                  </h2>
                </div>
                {template.description && (
                  <p
                    className="text-[13px] leading-relaxed mb-3 line-clamp-2"
                    style={{ color: 'var(--ed-secondary)' }}
                  >
                    {template.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {template.category && (
                    <span
                      className="text-[11px] font-medium tracking-[0.08em] uppercase"
                      style={{ color: 'var(--ed-muted)' }}
                    >
                      {categoryLabel[template.category] ?? template.category}
                    </span>
                  )}
                  <span
                    className="text-[16px] ml-auto transition-transform group-hover:translate-x-1"
                    style={{ color: 'var(--ed-accent)' }}
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
