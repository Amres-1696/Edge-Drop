import { useStore } from '../store/appStore'

export function EmptyState({ filtered }: { filtered: boolean }) {
  const typeFilter = useStore((s) => s.typeFilter)

  let title = filtered ? 'No results found' : 'Shelf is empty'
  let hint = filtered ? 'Try a different keyword or clear search' : 'Copy anything or drop files here to begin'

  if (typeFilter !== 'all') {
    const label = typeFilter === 'text' ? 'text clips' : typeFilter === 'links' ? 'links' : typeFilter === 'images' ? 'images' : 'files'
    title = `No ${label} found`
    hint = `Copy ${label} or switch back to All`
  }

  return (
    <div className="empty">
      <div className="empty-text">
        <div className="big">{title}</div>
        <div className="hint">{hint}</div>
      </div>
    </div>
  )
}
