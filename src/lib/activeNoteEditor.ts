type FlushEditor = () => Promise<boolean>

let activeFlush: FlushEditor | null = null

export function registerActiveNoteEditor(flush: FlushEditor): () => void {
  activeFlush = flush
  return () => {
    if (activeFlush === flush) activeFlush = null
  }
}

/** Save the open note before navigation unmounts its editor. */
export async function flushActiveNoteEditor(): Promise<boolean> {
  return activeFlush ? activeFlush() : true
}
