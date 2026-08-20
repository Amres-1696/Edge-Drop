/**
 * Keep the clipboard DOM bounded. A panel viewport only shows a handful of
 * cards, while a history can contain up to 1000 entries. Mounting every card
 * makes Framer measure hundreds of layout nodes whenever the blade opens.
 */
export const ITEM_RENDER_BATCH = 48

export function nextVisibleItemCount(current: number, total: number): number {
  return Math.min(total, current + ITEM_RENDER_BATCH)
}
