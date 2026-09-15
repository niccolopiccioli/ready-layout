'use client'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 30 : 38
  return (
    <span className="group inline-flex items-center gap-3 select-none cursor-pointer">
      <span className="relative shrink-0" style={{ width: box, height: box }}>
        {/* orbit ring */}
        <span
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, #00e5ff, #7c3aed, #ff2ea6, transparent 70%, #00e5ff)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), black calc(100% - 2px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), black calc(100% - 2px))',
            opacity: 0.9,
          }}
        />
        {/* core */}
        <span
          className="absolute transition-transform duration-500 group-hover:scale-110 group-hover:rotate-45"
          style={{
            inset: 7,
            background: 'linear-gradient(135deg, #00e5ff 0%, #4f7cff 50%, #ff2ea6 100%)',
            clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
            boxShadow: '0 0 18px rgba(0,229,255,0.6)',
          }}
        />
        <span
          className="absolute"
          style={{
            inset: 13,
            background: '#05050a',
            clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          }}
        />
        <span
          className="absolute rounded-full animate-pulse"
          style={{ inset: 16.5, background: '#00e5ff', boxShadow: '0 0 12px #00e5ff' }}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className="font-display font-extrabold tracking-tight"
          style={{ fontSize: size === 'sm' ? 15 : 19, color: '#fff', letterSpacing: '-0.02em' }}
        >
          READY<span className="rl-neon-text">LAYOUT</span>
        </span>
        <span className="font-hud" style={{ fontSize: 8.5, letterSpacing: '0.32em', color: 'rgba(0,229,255,0.7)', marginTop: 3 }}>
          NO-CODE ENGINE
        </span>
      </span>
    </span>
  )
}
