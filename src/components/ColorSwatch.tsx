import { motion } from 'framer-motion'

interface ColorSwatchProps {
  color: string
  accent: string
  name: string
  active?: boolean
  onClick?: () => void
}

export function ColorSwatch({
  color,
  accent,
  name,
  active = false,
  onClick,
}: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Select ${name} colorway`}
      aria-pressed={active}
      className="group flex flex-col items-center gap-3"
    >
      <span
        className={`relative block h-12 w-12 rounded-full transition-transform duration-500 md:h-14 md:w-14 ${
          active ? 'scale-110' : 'scale-100 group-hover:scale-105'
        }`}
        style={{
          background: `linear-gradient(135deg, ${color} 50%, ${accent} 50%)`,
          boxShadow: active ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${accent}` : 'none',
        }}
      />
      <span
        className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
          active ? 'text-fg' : 'text-muted group-hover:text-fg'
        }`}
      >
        {name.split(' ')[0]}
      </span>
    </button>
  )
}

interface ColorwayLabelProps {
  name: string
  accent: string
}

export function ColorwayLabel({ name, accent }: ColorwayLabelProps) {
  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-baseline gap-4"
    >
      <span
        className="font-display text-[clamp(2rem,6vw,4.5rem)] uppercase leading-none"
        style={{ color: accent }}
      >
        {name}
      </span>
    </motion.div>
  )
}
