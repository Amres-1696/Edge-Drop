import { type RefObject, useEffect } from 'react'
import { edge } from '../lib/edge'
import { useStore } from '../store/appStore'

const activeScopes = new Set<string>()
let modeActive = false
let intentionalBlurUntil = 0

async function syncMode(): Promise<void> {
  const next = activeScopes.size > 0
  if (next === modeActive) return
  modeActive = next
  if (!next) intentionalBlurUntil = Date.now() + 700
  await edge.setTextInputActive(next)
}

/** True briefly while we intentionally return the shelf to no-focus mode. */
export function isIntentionalTextInputBlur(): boolean {
  return Date.now() < intentionalBlurUntil
}

/** Mark a deliberate focus release so the edge-hover blur handler stays open. */
export function markIntentionalTextInputBlur(durationMs = 700): void {
  intentionalBlurUntil = Math.max(intentionalBlurUntil, Date.now() + durationMs)
}

export function isTextInputModeActive(): boolean {
  return activeScopes.size > 0
}

/**
 * Acquires keyboard focus only while an editor is visible. A small scope set
 * keeps overlapping surfaces (for example search + composer) from disabling
 * focus underneath one another.
 */
export function useTextInputMode<T extends HTMLElement>(
  scope: string,
  active: boolean,
  inputRef: RefObject<T | null>
): void {
  const panelOpen = useStore((state) => state.open)

  useEffect(() => {
    if (!active || !panelOpen) return
    let cancelled = false
    activeScopes.add(scope)
    void syncMode().then(() => {
      if (cancelled) return
      window.requestAnimationFrame(() => {
        if (!cancelled) inputRef.current?.focus({ preventScroll: true })
      })
    })
    return () => {
      cancelled = true
      activeScopes.delete(scope)
      void syncMode()
    }
  }, [active, inputRef, panelOpen, scope])
}
