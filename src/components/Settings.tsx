import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/appStore'
import type { DisplayInfo } from '../../shared/types'
import { LiquidOctopusLoader } from './LiquidOctopusLoader'
import { TickIndicatorIcon, CopyIndicatorIcon, SparkleIndicatorIcon } from './CopyIndicatorCurve'
import { ChevronRightIcon, CloseIcon, LogOutIcon } from './icons'
import { ChangelogView } from './ChangelogView'
import '../styles/settings.css'

export function Settings({ inlineIndicatorStyle }: { inlineIndicatorStyle?: boolean }) {
  const settings = useStore((s) => s.settings)
  const patch = useStore((s) => s.patchSettings)
  const updateInfo = useStore((s) => s.updateInfo)
  const installUpdate = useStore((s) => s.installUpdate)
  const currentVersion = useStore((s) => s.currentVersion)
  const styleFlyoutOpen = useStore((s) => s.styleFlyoutOpen)
  const setStyleFlyoutOpen = useStore((s) => s.setStyleFlyoutOpen)
  const settingsSubView = useStore((s) => s.settingsSubView)

  const [localInlineOpen, setLocalInlineOpen] = useState(false)
  const isTutorial = inlineIndicatorStyle || (typeof window !== 'undefined' && window.location.hash.includes('onboarding'))

  const isFlyoutActive = isTutorial ? localInlineOpen : styleFlyoutOpen

  const handleToggleFlyout = () => {
    if (isTutorial) {
      setLocalInlineOpen(!localInlineOpen)
    } else {
      setStyleFlyoutOpen(!styleFlyoutOpen)
    }
  }

  const [displays, setDisplays] = useState<DisplayInfo[]>([])
  useEffect(() => {
    window.edge.getDisplays().then(setDisplays).catch(() => {})
  }, [])

  return (
    <AnimatePresence mode="wait">
      {settingsSubView === 'changelog' ? (
        <motion.div
          key="changelog-view"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ type: 'spring', stiffness: 400, damping: 36, mass: 0.6 }}
          style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
        >
          <ChangelogView />
        </motion.div>
      ) : (
        <motion.div
          key="main-settings"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ type: 'spring', stiffness: 400, damping: 36, mass: 0.6 }}
          style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
        >
          <div className="settings-list">

      {/* ── Update banner ───────────────────────────────────────────── */}
      {updateInfo?.hasUpdate && (
        <>
          <div className="update-prompt">
            <div className="update-text">
              {updateInfo.downloaded
                ? `Update ${updateInfo.latestVersion} is ready to install.`
                : `Downloading update ${updateInfo.latestVersion} in the background...`}
            </div>
            <button
              className="update-btn"
              disabled={!updateInfo.downloaded}
              onClick={() => void installUpdate()}
            >
              {updateInfo.downloaded ? `Restart to Update` : `Downloading...`}
            </button>
          </div>
          <div className="setting-divider" />
        </>
      )}

      {/* ══ GROUP: Behaviour ════════════════════════════════════════════ */}
      <div className="setting-group-label">Behaviour</div>

      <div className="setting-row">
        <div className="setting-info">
          <div className="setting-title">Launch at login</div>
          <div className="setting-desc">Start silently in background when computer boots</div>
        </div>
        <Toggle
          checked={settings.launchAtLogin}
          onChange={(v) => patch({ launchAtLogin: v })}
        />
      </div>

      <div className="setting-divider" />

      <div className="setting-row">
        <div className="setting-info">
          <div className="setting-title">Incognito mode</div>
          <div className="setting-desc">Temporarily pause recording new clipboard items</div>
        </div>
        <Toggle
          checked={settings.incognito}
          onChange={(v) => patch({ incognito: v })}
        />
      </div>

      <div className="setting-divider" />

      <div className="setting-row">
        <div className="setting-info">
          <div className="setting-title">Fullscreen Protection</div>
          <div className="setting-desc">Automatically pause edge hover while playing games or watching fullscreen videos</div>
        </div>
        <Toggle
          checked={settings.suppressInFullscreen}
          onChange={(v) => patch({ suppressInFullscreen: v })}
        />
      </div>

      <div className="setting-divider" />

      <div className="setting-row">
        <div className="setting-info">
          <div className="setting-title">Clear unpinned on restart</div>
          <div className="setting-desc">Wipe unpinned items whenever the app restarts</div>
        </div>
        <Toggle
          checked={settings.clearUnpinnedOnRestart}
          onChange={(v) => patch({ clearUnpinnedOnRestart: v })}
        />
      </div>

      <div className="setting-divider" />

      <div className="setting-row vertical">
        <div className="setting-info">
          <div className="setting-title">Auto-delete timer</div>
          <div className="setting-desc">Automatically purge copied items (preserves Pinned)</div>
        </div>
        <div className="setting-pills">
          {[
            { label: 'Never', val: 0 },
            { label: '1h', val: 1 },
            { label: '6h', val: 6 },
            { label: '24h', val: 24 },
            { label: '7d', val: 168 }
          ].map((opt) => (
            <button
              key={opt.val}
              className={`pill ${settings.autoDeleteHours === opt.val ? 'active' : ''}`}
              onClick={() => patch({ autoDeleteHours: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-divider" />

      <div className="setting-row vertical">
        <div className="setting-info">
          <div className="setting-title">History capacity</div>
          <div className="setting-desc">Maximum unpinned items stored in history</div>
        </div>
        <div className="setting-pills">
          {[
            { label: '100', val: 100 },
            { label: '250', val: 250 },
            { label: '500', val: 500 },
            { label: '1000', val: 1000 }
          ].map((opt) => (
            <button
              key={opt.val}
              className={`pill ${settings.historyLimit === opt.val ? 'active' : ''}`}
              onClick={() => patch({ historyLimit: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ GROUP: Position ═════════════════════════════════════════════ */}
      <div className="setting-group-label" style={{ marginTop: 20 }}>Position</div>

      <div className="setting-row vertical">
        <div className="setting-info">
          <div className="setting-title">Stick position</div>
          <div className="setting-desc">Screen edge to attach the panel to</div>
        </div>
        <div className="setting-pills">
          {[
            { label: 'Left', val: 'left' as const },
            { label: 'Right', val: 'right' as const }
          ].map((opt) => (
            <button
              key={opt.label}
              className={`pill ${settings.stickPosition === opt.val ? 'active' : ''}`}
              onClick={() => patch({ stickPosition: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-divider" />

      {/* Vertical Position Presets */}
      <div className="setting-row vertical">
        <div className="setting-info">
          <div className="setting-title">Vertical position</div>
          <div className="setting-desc">Vertical alignment of the shelf along the screen edge</div>
        </div>
        <div className="setting-pills">
          {[
            { label: 'Top', val: 0 },
            { label: 'Center', val: 0.5 },
            { label: 'Bottom', val: 1.0 }
          ].map((opt) => (
            <button
              key={opt.label}
              className={`pill ${Math.abs((settings.verticalOffset ?? 0.5) - opt.val) < 0.05 ? 'active' : ''}`}
              onClick={() => patch({ verticalOffset: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-divider" />

      <div className="setting-row vertical">
        <div className="setting-info">
          <div className="setting-title">Display</div>
          <div className="setting-desc">Monitor to stick the panel to</div>
        </div>
        <div className="setting-pills">
          {displays.length === 0 && <div className="pill disabled">Loading...</div>}
          {displays.map((d) => {
            const currentDisplay = displays.find((disp) => disp.isCurrent)
            const activeDisplayId = currentDisplay
              ? currentDisplay.id
              : (settings.stickDisplayId ?? displays.find((disp) => disp.isPrimary)?.id ?? displays[0]?.id)
            const isActive = activeDisplayId === d.id
            return (
              <button
                key={d.id}
                className={`pill display-pill ${isActive ? 'active' : ''}`}
                onClick={() => patch({ stickDisplayId: d.id })}
              >
                <div className="pill-name">{d.name}</div>
                <div className="pill-res">{d.resolution}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ══ GROUP: Trigger zone ═════════════════════════════════════════ */}
      <div className="setting-group-label" style={{ marginTop: 20 }}>Trigger Zone</div>

      <div className="setting-row vertical">
        <div className="setting-info">
          <div className="setting-title">Edge trigger height</div>
          <div className="setting-desc">Hover area size on the screen edge</div>
        </div>
        <div className="setting-pills">
          {[
            { label: 'Small', val: 0.25 },
            { label: 'Medium', val: 0.4 },
            { label: 'Large', val: 0.6 }
          ].map((opt) => (
            <button
              key={opt.label}
              className={`pill ${Math.abs(settings.hotZoneHeight - opt.val) < 0.08 ? 'active' : ''}`}
              onClick={() => patch({ hotZoneHeight: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-divider" />

      <div className="setting-row vertical">
        <div className="setting-info">
          <div className="setting-title">Edge trigger thickness</div>
          <div className="setting-desc">Physical thickness of the invisible trigger strip</div>
        </div>
        <div className="setting-pills">
          {[
            { label: 'Small', val: 3 },
            { label: 'Medium', val: 6 },
            { label: 'Large', val: 12 }
          ].map((opt) => (
            <button
              key={opt.label}
              className={`pill ${settings.hotZoneWidth === opt.val ? 'active' : ''}`}
              onClick={() => patch({ hotZoneWidth: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-divider" />

      <div className="setting-row vertical">
        <div className="setting-info">
          <div className="setting-title">Panel height</div>
          <div className="setting-desc">Vertical size of the clipboard shelf</div>
        </div>
        <div className="setting-pills">
          {[
            { label: 'Small', val: 0.5 },
            { label: 'Medium', val: 0.65 },
            { label: 'Large', val: 0.8 }
          ].map((opt) => (
            <button
              key={opt.label}
              className={`pill ${Math.abs((settings.panelHeight || 0.6) - opt.val) < 0.08 ? 'active' : ''}`}
              onClick={() => patch({ panelHeight: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ GROUP: Copy Indicator ═══════════════════════════════════════ */}
      <div className="setting-group-label" style={{ marginTop: 20 }}>Copy Indicator</div>

      <div className="setting-row">
        <div className="setting-info">
          <div className="setting-title">Copy indication</div>
          <div className="setting-desc">Show visual morph animation when content is copied</div>
        </div>
        <Toggle
          checked={settings.showCopyIndicator ?? true}
          onChange={(v) => patch({ showCopyIndicator: v })}
        />
      </div>

      {(settings.showCopyIndicator ?? true) && (
        <>
          <div className="setting-divider" />

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-title">Indicator style</div>
              <div className="setting-desc">
                {settings.copyIndicatorStyle === 'check'
                  ? 'Active: Tick Icon'
                  : settings.copyIndicatorStyle === 'copy'
                  ? 'Active: Copy Icon'
                  : settings.copyIndicatorStyle === 'sparkle'
                  ? 'Active: Sparkle'
                  : 'Active: Edge-Drop Logo'}
              </div>
            </div>
            
            <button
              type="button"
              className={`icon-btn style-preview-toggle-btn ${isFlyoutActive ? 'active' : ''}`}
              title={isFlyoutActive ? 'Close Style Selector' : 'Open Indicator Style Selector'}
              onClick={handleToggleFlyout}
            >
              {isFlyoutActive ? <CloseIcon /> : <ChevronRightIcon />}
            </button>
          </div>

          {isTutorial && localInlineOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ overflow: 'hidden', marginTop: 12, marginBottom: 8 }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10,
                padding: 12,
                background: '#09090b',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {/* Logo Card */}
                <div
                  onClick={() => patch({ copyIndicatorStyle: 'logo' })}
                  style={{
                    background: (settings.copyIndicatorStyle || 'logo') === 'logo' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: (settings.copyIndicatorStyle || 'logo') === 'logo' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    gap: 8,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LiquidOctopusLoader fillColor="#ffffff" glowColor="rgba(255, 255, 255, 0.85)" speed={1.2} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>Logo</div>
                </div>

                {/* Tick Card */}
                <div
                  onClick={() => patch({ copyIndicatorStyle: 'check' })}
                  style={{
                    background: settings.copyIndicatorStyle === 'check' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: settings.copyIndicatorStyle === 'check' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    gap: 8,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TickIndicatorIcon fillColor="#ffffff" glowColor="rgba(255, 255, 255, 0.85)" size={30} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>Tick</div>
                </div>

                {/* Copy Card */}
                <div
                  onClick={() => patch({ copyIndicatorStyle: 'copy' })}
                  style={{
                    background: settings.copyIndicatorStyle === 'copy' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: settings.copyIndicatorStyle === 'copy' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    gap: 8,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CopyIndicatorIcon fillColor="#ffffff" glowColor="rgba(255, 255, 255, 0.85)" size={30} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>Copy</div>
                </div>

                {/* Sparkle Card */}
                <div
                  onClick={() => patch({ copyIndicatorStyle: 'sparkle' })}
                  style={{
                    background: settings.copyIndicatorStyle === 'sparkle' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: settings.copyIndicatorStyle === 'sparkle' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    gap: 8,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SparkleIndicatorIcon fillColor="#ffffff" glowColor="rgba(255, 255, 255, 0.85)" size={30} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>Sparkle</div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* ══ GROUP: ANIMATIONS ═══════════════════════════════════════════ */}
      <div className="setting-group-label" style={{ marginTop: 20 }}>ANIMATIONS</div>

      <div className="setting-row">
        <div className="setting-info">
          <div className="setting-title">Bounce Animation</div>
          <div className="setting-desc">Adds a springy overshoot pop when the panel opens.</div>
          <div className="setting-badge-subtle">May slightly affect performance</div>
        </div>
        <Toggle
          checked={settings.bounceAnimation ?? false}
          onChange={(v) => patch({ bounceAnimation: v })}
        />
      </div>

      {/* ══ GROUP: Community & Support ════════════════════════════════════ */}
      <div className="setting-group-label" style={{ marginTop: 20 }}>COMMUNITY & SUPPORT</div>

      <div className="setting-row vertical" style={{ gap: 10 }}>
        <div className="setting-info">
          <div className="setting-title">Feedback & Issues</div>
          <div className="setting-desc">Report bugs or suggest features on GitHub</div>
        </div>
        <button
          className="pill display-pill"
          style={{ width: '100%', justifyContent: 'center', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12.5px' }}
          onClick={() => window.open('https://github.com/Deepender25/Edge-Drop/issues/new/choose', '_blank')}
        >
          Submit Feedback ↗
        </button>
      </div>

      {/* ══ GROUP: Application ═══════════════════════════════════════════ */}
      <div className="setting-group-label" style={{ marginTop: 20 }}>APPLICATION</div>

      <div className="setting-row vertical" style={{ gap: 10 }}>
        <div className="setting-info">
          <div className="setting-title">Quit Edge-Drop</div>
          <div className="setting-desc">Close application and stop background process</div>
        </div>
        <button
          className="quit-app-btn"
          onClick={() => void window.edge.quitApp()}
        >
          <LogOutIcon width={14} height={14} />
          Quit Edge-Drop
        </button>
      </div>

      {/* ══ Footer ══════════════════════════════════════════════════════ */}
      <div className="setting-divider" style={{ marginTop: 16 }} />

      <div className="github-promo">
        <div className="github-promo-text">
          If you like Edge-Drop, please consider starring the project on GitHub!
        </div>
        <button
          className="github-promo-btn"
          onClick={() => window.open('https://github.com/Deepender25/Edge-Drop', '_blank')}
        >
          <svg
            className="star-icon"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            style={{ marginRight: 6 }}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          Star on GitHub
        </button>
        <div className="app-version-footer">
          Version {currentVersion || '0.1.0'}
        </div>
      </div>
    </div>
  </motion.div>
)}
</AnimatePresence>
  )
}

function Toggle({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      className={`setting-toggle${checked ? ' checked' : ''}`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        flexShrink: 0,
        width: 38,
        height: 22,
        borderRadius: 999,
        background: checked ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
        border: checked ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
        transition: 'background 0.22s ease, border-color 0.22s ease',
        boxShadow: checked ? '0 0 12px rgba(255, 255, 255, 0.25)' : 'none'
      }}
    >
      <motion.span
        className="toggle-thumb"
        initial={false}
        animate={{
          x: checked ? 18 : 2,
          backgroundColor: checked ? '#000000' : '#ffffff'
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 35
        }}
        style={{
          position: 'absolute',
          top: 2,
          left: 0,
          width: 16,
          height: 16,
          borderRadius: '50%',
          boxShadow: '0 1.5px 4px rgba(0, 0, 0, 0.4)'
        }}
      />
    </button>
  )
}
