import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useStore } from '../store/appStore'
import { GearIcon, CloseIcon, InfoIcon } from './icons'
import { playButtonClickSound } from '../lib/soundEffects'
import { useTranslation } from '../i18n'
import { CELL_SPRING, CROSSFADE_SPRING, INSTANT } from '../lib/motion'
import { useTextInputMode } from '../hooks/useTextInputMode'
import { flushActiveNoteEditor } from '../lib/activeNoteEditor'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
  </svg>
)

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export function Header() {
  const systemReduced = useReducedMotion()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const settings = useStore((s) => s.settings)
  const reduced = systemReduced || settings.reduceMotion
  const settingsOpen = useStore((s) => s.settingsOpen)
  const setSettingsOpen = useStore((s) => s.setSettingsOpen)
  const settingsSubView = useStore((s) => s.settingsSubView)
  const setSettingsSubView = useStore((s) => s.setSettingsSubView)
  const patchSettings = useStore((s) => s.patchSettings)
  const currentVersion = useStore((s) => s.currentVersion)
  const updateInfo = useStore((s) => s.updateInfo)
  const workspace = useStore((s) => s.workspaceMode)
  const setWorkspace = useStore((s) => s.setWorkspaceMode)
  const recordView = useStore((s) => s.recordView)
  const setRecordView = useStore((s) => s.setRecordView)
  const typeFilter = useStore((s) => s.typeFilter)
  const setTypeFilter = useStore((s) => s.setTypeFilter)
  const query = useStore((s) => workspace === 'clipboard' ? s.query : s.recordQuery)
  const setQuery = useStore((s) => workspace === 'clipboard' ? s.setQuery : s.setRecordQuery)
  const searchExpanded = useStore((s) => s.searchExpanded)
  const setSearchExpanded = useStore((s) => s.setSearchExpanded)
  const composerOpen = useStore((s) => s.recordComposerOpen)
  const setComposerOpen = useStore((s) => s.setRecordComposerOpen)

  useTextInputMode('header-search', searchExpanded && !settingsOpen, inputRef)

  const filters = [
    ['all', t('filters.all')], ['text', t('filters.text')], ['links', t('filters.links')],
    ['images', t('filters.images')], ['files', t('filters.files')]
  ] as const
  const activeFilterIndex = Math.max(0, filters.findIndex(([id]) => id === typeFilter))
  const maxFilterLength = Math.max(...filters.map(([, label]) => Array.from(label).length))
  const filterFontSize = maxFilterLength >= 8 ? 7.8 : maxFilterLength >= 6 ? 8.5 : maxFilterLength >= 5 ? 9.2 : 10.2
  const filterLetterSpacing = maxFilterLength >= 7 ? '-0.025em' : maxFilterLength >= 5 ? '-0.015em' : '0'

  const changelogUnread = settingsOpen && (!settings.lastSeenChangelogVersion ||
    (currentVersion && settings.lastSeenChangelogVersion !== currentVersion && settings.lastSeenChangelogVersion !== `v${currentVersion}`))

  const toggleSettings = async () => {
    playButtonClickSound()
    if (settingsOpen) {
      setSettingsOpen(false)
      setSettingsSubView('main')
      return
    }
    if (!(await flushActiveNoteEditor())) return
    const state = useStore.getState()
    state.setPreviewItemId(null)
    state.setStyleFlyoutOpen(false)
    setSettingsOpen(true)
  }

  const changeWorkspace = async (mode: 'clipboard' | 'records') => {
    playButtonClickSound()
    if (mode === workspace) return
    if (!(await flushActiveNoteEditor())) return
    setWorkspace(mode)
  }

  const changeRecordView = async (view: 'notes' | 'todos') => {
    playButtonClickSound()
    if (view === recordView) return
    if (!(await flushActiveNoteEditor())) return
    setRecordView(view)
  }

  const openChangelog = () => {
    playButtonClickSound()
    if (settingsSubView === 'changelog') setSettingsSubView('main')
    else {
      setSettingsSubView('changelog')
      if (currentVersion) void patchSettings({ lastSeenChangelogVersion: currentVersion })
    }
  }

  if (settingsOpen) {
    return (
      <header className="workspace-header settings-header-compact">
        <div className="workspace-top-row">
          <span className="settings-header-title">{settingsSubView === 'changelog' ? t('header.whatsNew') : t('header.settings')}</span>
          <div className="workspace-header-actions">
            <button className={`icon-btn${settingsSubView === 'changelog' ? ' active' : ''}`} title={t('header.whatsNew')} onClick={openChangelog}>
              <InfoIcon width={16} height={16} />
              {changelogUnread && <span className="header-unread-dot" />}
            </button>
            <button className="icon-btn active" title={t('header.close')} onClick={toggleSettings}>
              <CloseIcon />
            </button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="workspace-header">
      <div className="workspace-top-row">
        <div className="workspace-switch" data-mode={workspace}>
          <motion.span
            className="workspace-switch-pill"
            animate={{ x: workspace === 'records' ? 70 : 0 }}
            transition={reduced ? INSTANT : CELL_SPRING}
          />
          {(['clipboard', 'records'] as const).map((mode) => (
            <button key={mode} className={workspace === mode ? 'active' : ''} onClick={() => void changeWorkspace(mode)}>
              {mode === 'clipboard' ? t('records.workspaceClipboard') : t('records.workspaceRecords')}
            </button>
          ))}
        </div>

        <div className={`expanding-search${searchExpanded ? ' open' : ''}`}>
          <button className="icon-btn" title={t('records.search')} onClick={() => {
            if (searchExpanded && !query) setSearchExpanded(false)
            else setSearchExpanded(true)
          }}><SearchIcon /></button>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') { setQuery(''); setSearchExpanded(false) }
            }}
            placeholder={t('records.searchPlaceholder')}
            aria-label={t('records.search')}
          />
        </div>

        <button className="icon-btn" title={t('header.settings')} onClick={() => void toggleSettings()}>
          <AnimatePresence initial={false} mode="wait">
            <motion.span key="gear" className="micro-icon-slot" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={reduced ? INSTANT : CROSSFADE_SPRING}>
              <GearIcon />
            </motion.span>
          </AnimatePresence>
          {(updateInfo?.downloaded || ((settings.autoUpdates ?? true) && updateInfo?.hasUpdate)) && <span className="header-update-dot" />}
        </button>
      </div>

      <div className="workspace-sub-row">
        {workspace === 'clipboard' ? (
          <div className="filter-segmented-track contextual-filters">
            <motion.div className="filter-slide-pill" animate={{ x: activeFilterIndex * 41 }} transition={reduced ? INSTANT : CELL_SPRING} />
            {filters.map(([id, label]) => (
              <button key={id} className={`filter-chip${typeFilter === id ? ' active' : ''}`} style={{ fontSize: filterFontSize, letterSpacing: filterLetterSpacing }} onClick={() => {
                playButtonClickSound(); setTypeFilter(id)
              }}>{label}</button>
            ))}
          </div>
        ) : (
          <>
            <div className="records-segmented">
              <motion.span className="records-segmented-pill" animate={{ x: recordView === 'todos' ? 52 : 0 }} transition={reduced ? INSTANT : CELL_SPRING} />
              {(['notes', 'todos'] as const).map((view) => (
                <button key={view} className={recordView === view ? 'active' : ''} onClick={() => void changeRecordView(view)}>{view === 'notes' ? t('records.notes') : t('records.todos')}</button>
              ))}
            </div>
            <motion.button className={`records-add-btn${composerOpen ? ' active' : ''}`} title={recordView === 'notes' ? t('records.newNote') : t('records.newTodo')} whileTap={reduced ? undefined : { y: 1, scale: .94 }} onClick={() => setComposerOpen(!composerOpen)}>
              <PlusIcon />
            </motion.button>
          </>
        )}
      </div>
    </header>
  )
}
