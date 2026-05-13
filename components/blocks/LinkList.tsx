interface LinkItem {
  label: string
  url: string
  emoji: string
}

interface LinkListProps {
  name: string
  bio: string
  avatar: string
  bgColor: string
  textColor: string
  accentColor: string
  links: LinkItem[]
}

export function LinkList({ name, bio, avatar, bgColor, textColor, accentColor, links }: LinkListProps) {
  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="min-h-screen py-16 px-6">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Avatar */}
        {avatar && (
          <div className="mb-5">
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}

        {/* Name */}
        {name && (
          <h1 className="text-xl font-semibold tracking-tight mb-2 text-center">
            {name}
          </h1>
        )}

        {/* Bio */}
        {bio && (
          <p className="text-sm opacity-60 text-center leading-relaxed mb-10 max-w-[40ch]">
            {bio}
          </p>
        )}

        {/* Links */}
        <div className="flex flex-col gap-3 w-full">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-5 py-4 rounded transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] text-sm font-medium"
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: accentColor + '55',
                backgroundColor: accentColor + '11',
                color: textColor,
              }}
            >
              {link.emoji && (
                <span className="text-base leading-none">{link.emoji}</span>
              )}
              <span className="flex-1 text-center">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
