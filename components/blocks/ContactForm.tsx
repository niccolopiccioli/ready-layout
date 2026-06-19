'use client'

import { richProps } from '@/lib/richtext'

interface ContactFormProps {
  sectionTitle: string
  subtext: string
  submitLabel: string
  emailPlaceholder: string
  showName: string
  showMessage: string
  bgColor: string
  textColor: string
}

export function ContactForm({
  sectionTitle,
  subtext,
  submitLabel,
  emailPlaceholder,
  showName,
  showMessage,
  bgColor,
  textColor,
}: ContactFormProps) {
  const displayName = showName === 'true'
  const displayMessage = showMessage === 'true'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="py-20 md:py-28">
      <div className="max-w-md mx-auto px-6">
        {sectionTitle && (
          <h2 data-field="sectionTitle" data-field-type="text" className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15] mb-3" {...richProps(sectionTitle)} />
        )}
        {subtext && (
          <p data-field="subtext" data-field-type="text" className="text-base opacity-60 mb-10 leading-relaxed" {...richProps(subtext)} />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {displayName && (
            <div>
              <input
                type="text"
                placeholder="Nome"
                className="w-full bg-transparent border-b pb-2 text-base placeholder:opacity-40 focus:outline-none focus:border-current transition-colors"
                style={{ borderColor: 'currentColor', opacity: 1 }}
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder={emailPlaceholder || 'Email'}
              required
              className="w-full bg-transparent border-b pb-2 text-base placeholder:opacity-40 focus:outline-none transition-colors"
              style={{ borderColor: 'currentColor' }}
            />
          </div>

          {displayMessage && (
            <div>
              <textarea
                placeholder="Messaggio"
                rows={4}
                className="w-full bg-transparent border-b pb-2 text-base placeholder:opacity-40 focus:outline-none resize-none transition-colors"
                style={{ borderColor: 'currentColor' }}
              />
            </div>
          )}

          <button
            type="submit"
            data-field="submitLabel"
            data-field-type="text"
            className="w-full py-4 text-sm font-semibold tracking-wide transition-opacity hover:opacity-80 active:opacity-60 mt-2"
            style={{ backgroundColor: textColor, color: bgColor }}
            {...richProps(submitLabel || 'Invia')}
          />
        </form>
      </div>
    </section>
  )
}