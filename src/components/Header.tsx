/** Panel header: title + settings toggle. */
import { motion } from 'framer-motion'
import { useStore } from '../store/appStore'
import { GearIcon, CloseIcon, InfoIcon } from './icons'

export function Header() {
  const setSettingsOpen = useStore((s) => s.setSettingsOpen)
  const settingsOpen = useStore((s) => s.settingsOpen)
  const updateInfo = useStore((s) => s.updateInfo)
  const settingsSubView = useStore((s) => s.settingsSubView)
  const setSettingsSubView = useStore((s) => s.setSettingsSubView)
  const settings = useStore((s) => s.settings)
  const patchSettings = useStore((s) => s.patchSettings)
  const currentVersion = useStore((s) => s.currentVersion)

  const isChangelogUnread = settingsOpen && (
    !settings.lastSeenChangelogVersion ||
    (currentVersion && settings.lastSeenChangelogVersion !== currentVersion && settings.lastSeenChangelogVersion !== `v${currentVersion}`)
  )

  const handleOpenChangelog = () => {
    if (settingsSubView === 'changelog') {
      setSettingsSubView('main')
    } else {
      setSettingsSubView('changelog')
      if (currentVersion) {
        patchSettings({ lastSeenChangelogVersion: currentVersion })
      }
    }
  }

  return (
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', height: 40, padding: '0 14px 0 6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 8 }}>
        {settingsOpen && (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#8e8e93', letterSpacing: '0.01em' }}>
            {settingsSubView === 'changelog' ? "What's New" : 'Settings'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {settingsOpen && (
          <button
            type="button"
            className={`icon-btn${settingsSubView === 'changelog' ? ' active' : ''}`}
            title={settingsSubView === 'changelog' ? "Back to Settings" : "What's New"}
            onClick={handleOpenChangelog}
            style={{
              color: settingsSubView === 'changelog' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              background: settingsSubView === 'changelog' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              border: 'none',
              boxShadow: 'none',
              flexShrink: 0,
              cursor: 'pointer',
              width: 32,
              height: 32,
              display: 'grid',
              placeItems: 'center',
              position: 'relative',
              borderRadius: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <InfoIcon width={16} height={16} />
            {isChangelogUnread && (
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 6px rgba(255, 255, 255, 0.6)',
                  border: '1.5px solid #000000',
                  pointerEvents: 'none'
                }}
              />
            )}
          </button>
        )}

        <motion.button
          type="button"
          layout
          className={`icon-btn${settingsOpen ? ' active' : ''}`}
          title={settingsOpen ? 'Close Settings' : 'Settings'}
          onClick={() => {
            setSettingsOpen(!settingsOpen)
            if (settingsOpen) {
              setSettingsSubView('main')
            }
          }}
          style={{
            color: '#ffffff',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            flexShrink: 0,
            cursor: 'pointer',
            width: 32,
            height: 32,
            display: 'grid',
            placeItems: 'center',
            position: 'relative'
          }}
        >
          {settingsOpen ? <CloseIcon /> : <GearIcon />}
          {!settingsOpen && updateInfo?.hasUpdate && (
            <span
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#f97316',
                border: '1.5px solid #000000',
                pointerEvents: 'none'
              }}
            />
          )}
        </motion.button>
      </div>
    </div>
  )
}
