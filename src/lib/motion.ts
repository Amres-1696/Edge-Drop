/** Shared motion language for short, event-driven interface feedback. */
export const ARRIVE_EASE = [0.23, 1, 0.32, 1] as const
export const LEAVE_EASE = [0.4, 0, 1, 1] as const

export const CELL_SPRING = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 34,
  mass: 0.45
}

export const SMALL_SPRING = {
  type: 'spring' as const,
  stiffness: 700,
  damping: 46,
  mass: 0.5
}

export const CROSSFADE_SPRING = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 34,
  mass: 0.8
}

export const INSTANT = { duration: 0 } as const
