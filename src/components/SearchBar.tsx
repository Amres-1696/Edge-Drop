/** Controlled search input bound to the store's query. */
import { useStore } from '../store/appStore'
import { useTranslation } from '../i18n'
import { SearchIcon } from './icons'

export function SearchBar() {
  const { t } = useTranslation()
  const query = useStore((s) => s.query)
  const setQuery = useStore((s) => s.setQuery)

  return (
    <div className="search">
      <SearchIcon className="search-icon" width={14} height={14} />
      <input
        type="text"
        placeholder={t('header.searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        spellCheck={false}
      />
    </div>
  )
}
