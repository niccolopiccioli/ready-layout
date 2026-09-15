'use client'

interface EmojiFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

const QUICK = ['✨', '🚀', '🔥', '💎', '⚡', '🌌', '🎯', '💜']

export function EmojiField({ id, label, value, onChange }: EmojiFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="ed-label">{label}</label>
      <div className="flex items-center gap-2.5 p-2 rounded-xl border border-white/8 bg-white/[0.025]">
        <div className="w-11 h-11 rounded-xl grid place-items-center text-[22px] shrink-0 border border-white/10 bg-black/40">
          {value || '✨'}
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ed-input text-center text-base"
          style={{ width: 76 }}
          maxLength={10}
          placeholder="✨"
        />
        <div className="flex-1 flex flex-wrap gap-1 justify-end">
          {QUICK.map((e) => (
            <button key={e} onClick={() => onChange(e)} className="ed-press w-7 h-7 grid place-items-center rounded-lg text-[15px] border border-transparent hover:border-cyan-400/40 hover:bg-cyan-400/10">
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
