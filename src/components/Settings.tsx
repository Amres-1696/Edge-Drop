import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/appStore'
import type { DisplayInfo } from '../../shared/types'
import { LiquidOctopusLoader } from './LiquidOctopusLoader'
import { TickIndicatorIcon, CopyIndicatorIcon, SparkleIndicatorIcon } from './CopyIndicatorCurve'
import { ChevronRightIcon, CloseIcon, LogOutIcon } from './icons'
import { ChangelogView } from './ChangelogView'
import { playDialTickSound, playToggleSound, playButtonClickSound } from '../lib/soundEffects'
import '../styles/settings.css'

type SettingsTab = 'behaviour' | 'position' | 'appearance'

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'behaviour',  label: 'Behaviour' },
  { id: 'position',   label: 'Position' },
  { id: 'appearance', label: 'Appearance' },
]

export function Settings({ inlineIndicatorStyle }: { inlineIndicatorStyle?: boolean }) {
  const settings = useStore((s) => s.settings)
  const patch = useStore((s) => s.patchSettings)
  const updateInfo = useStore((s) => s.updateInfo)
  const isStoreBuild = useStore((s) => s.isStoreBuild)
  const currentVersion = useStore((s) => s.currentVersion)
  const styleFlyoutOpen = useStore((s) => s.styleFlyoutOpen)
  const setStyleFlyoutOpen = useStore((s) => s.setStyleFlyoutOpen)
  const settingsSubView = useStore((s) => s.settingsSubView)
  const setSliderActive = useStore((s) => s.setSliderActive)

  const lastTickVal = useRef<number>(settings.verticalOffset ?? 0.5)

  const handleSliderInput = (rawVal: number) => {
    const clamped = Math.min(1.0, Math.max(0.0, rawVal))
    if (Math.abs(clamped - lastTickVal.current) >= 0.05) {
      lastTickVal.current = clamped
      playDialTickSound()
    }
    // Update store state immediately for butter-smooth 60fps real-time tracking
    useStore.setState((s) => ({
      settings: { ...s.settings, verticalOffset: clamped }
    }))
  }

  const handleSliderRelease = (rawVal: number) => {
    // Snap to nearest 5% tick on pointer release
    const snapped = Math.round(rawVal / 0.05) * 0.05
    const clamped = Math.min(1.0, Math.max(0.0, snapped))
    lastTickVal.current = clamped
    playDialTickSound()
    patch({ verticalOffset: clamped })
  }

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

  const updateDownloaded = updateInfo?.downloaded ? { version: updateInfo.latestVersion } : null
  const autoUpdates = settings.autoUpdates ?? true

  const [checkState, setCheckState] = useState<{
    status: 'idle' | 'checking' | 'up-to-date' | 'available' | 'downloading' | 'error'
    version?: string
    error?: string
  }>({ status: 'idle' })

  const handleManualCheck = async () => {
    setCheckState({ status: 'checking' })
    try {
      const res = await window.edge.checkForUpdatesManual()
      if (res.status === 'available') {
        setCheckState({ status: 'available', version: res.version })
      } else if (res.status === 'up-to-date') {
        setCheckState({ status: 'up-to-date', version: res.version })
      } else {
        setCheckState({ status: 'error', error: res.error || 'Check failed' })
      }
    } catch (err: any) {
      setCheckState({ status: 'error', error: err?.message || 'Check failed' })
    }
  }

  const handleStartDownload = async () => {
    setCheckState({ status: 'downloading' })
    try {
      await window.edge.startUpdateDownload()
    } catch {
      setCheckState({ status: 'error', error: 'Download failed' })
    }
  }

  // ── Tab state & Independent Scroll Memory per section ──────────────────────
  const [activeTab, setActiveTab] = useState<SettingsTab>('behaviour')
  const scrollListRef = useRef<HTMLDivElement>(null)
  const tabScrollPositions = useRef<Record<SettingsTab, number>>({
    behaviour: 0,
    position: 0,
    appearance: 0
  })

  const handleTabSwitch = (newTab: SettingsTab) => {
    if (newTab === activeTab) return
    // Save current section's scroll position
    if (scrollListRef.current) {
      tabScrollPositions.current[activeTab] = scrollListRef.current.scrollTop
    }
    playButtonClickSound()
    setActiveTab(newTab)
  }

  // Restore target section's independent scroll position when tab changes
  useEffect(() => {
    if (scrollListRef.current) {
      const targetPos = tabScrollPositions.current[activeTab] ?? 0
      scrollListRef.current.scrollTop = targetPos
    }
  }, [activeTab])

  // ── Persistent footer shared across all tabs ───────────────────────────
  const PersistentFooter = (
    <>
      {/* Community & Support */}
      <div className="setting-group-label" style={{ marginTop: 20 }}>Community & Support</div>

      <div className="setting-row vertical" style={{ gap: 10 }}>
        <div className="setting-info">
          <div className="setting-title">Feedback & Issues</div>
          <div className="setting-desc">Report bugs or suggest features on GitHub</div>
        </div>
        <button
          className="pill display-pill"
          style={{ width: '100%', justifyContent: 'center', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12.5px' }}
          onClick={() => {
            playButtonClickSound()
            window.open('https://github.com/Deepender25/Edge-Drop/issues/new/choose', '_blank')
          }}
        >
          Submit Feedback ↗
        </button>
      </div>

      {/* Application */}
      <div className="setting-group-label" style={{ marginTop: 20 }}>Application</div>

      <div className="setting-row vertical" style={{ gap: 10 }}>
        <div className="setting-info">
          <div className="setting-title">Quit Edge-Drop</div>
          <div className="setting-desc">Close application and stop background process</div>
        </div>
        <button
          className="quit-app-btn"
          onClick={() => {
            playButtonClickSound()
            void window.edge.quitApp()
          }}
        >
          <LogOutIcon width={14} height={14} />
          Quit Edge-Drop
        </button>
      </div>

      {/* GitHub promo footer */}
      <div className="setting-divider" style={{ marginTop: 16 }} />

      <div className="github-promo">
        <div className="github-promo-text">
          If you like Edge-Drop, please consider starring the project on GitHub!
        </div>
        <button
          className="github-promo-btn"
          onClick={() => {
            playButtonClickSound()
            window.open('https://github.com/Deepender25/Edge-Drop', '_blank')
          }}
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
    </>
  )

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
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          {/* ── Stationary Fixed Header (Tab Selector) ────────────────── */}
          <div className="settings-fixed-header">
            <div className="settings-tab-bar">
              {TABS.map((tab) => {
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`settings-tab-btn${active ? ' active' : ''}`}
                    onClick={() => handleTabSwitch(tab.id)}
                  >
                    <span className="settings-tab-text">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Scrollable Content Area (Independent per section) ───────── */}
          <div className="settings-scroll-list" ref={scrollListRef}>

            {/* ── Tab 1: Behaviour (First) ──────────────────────────────── */}
            <AnimatePresence mode="wait">
              {activeTab === 'behaviour' && (
                <motion.div
                  key="tab-behaviour"
                  initial={{ opacity: 0, scale: 0.98, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* ── GROUP: Behaviour ─────────────────────────────────── */}
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
                      <div className="setting-title">Hover Activation</div>
                      <div className="setting-desc" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '3px 5px', marginTop: 2 }}>
                        {(settings.hoverActivation ?? true) ? (
                          <span>Slide open shelf when hovering cursor near screen edge</span>
                        ) : (
                          <>
                            <span>Hover trigger paused. Use</span>
                            <kbd
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '1px 6px',
                                fontSize: 10.5,
                                fontWeight: 600,
                                fontFamily: 'inherit',
                                color: '#ffffff',
                                background: 'rgba(255, 255, 255, 0.14)',
                                border: '1px solid rgba(255, 255, 255, 0.28)',
                                borderRadius: 4,
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                whiteSpace: 'nowrap',
                                letterSpacing: '0.02em',
                                lineHeight: '14px'
                              }}
                            >
                              Alt + C
                            </kbd>
                            <span>to open.</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Toggle
                      checked={settings.hoverActivation ?? true}
                      onChange={(v) => {
                        if (!v) {
                          patch({ hoverActivation: false, suppressInFullscreen: false })
                        } else {
                          patch({ hoverActivation: true, suppressInFullscreen: true })
                        }
                      }}
                    />
                  </div>

                  <div className="setting-divider" />

                  <div className="setting-row" style={{ opacity: (settings.hoverActivation ?? true) ? 1 : 0.45, transition: 'opacity 0.2s ease' }}>
                    <div className="setting-info">
                      <div className="setting-title">Fullscreen Protection</div>
                      <div className="setting-desc">
                        {(settings.hoverActivation ?? true)
                          ? 'Automatically pause edge hover while playing games or watching fullscreen videos'
                          : 'Disabled because Hover Activation is turned off'}
                      </div>
                    </div>
                    <Toggle
                      checked={(settings.hoverActivation ?? true) ? settings.suppressInFullscreen : false}
                      onChange={(v) => (settings.hoverActivation ?? true) && patch({ suppressInFullscreen: v })}
                      disabled={!(settings.hoverActivation ?? true)}
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

                  {!isStoreBuild && (
                    <>
                      <div className="setting-divider" />

                      <div className="setting-row">
                        <div className="setting-info">
                          <div className="setting-title">Automatic updates</div>
                          <div className="setting-desc">
                            {(settings.autoUpdates ?? true)
                              ? 'Check for and download app updates automatically in background'
                              : 'Background update checks paused. Check for updates manually below'}
                          </div>
                        </div>
                        <Toggle
                          checked={settings.autoUpdates ?? true}
                          onChange={(v) => patch({ autoUpdates: v })}
                        />
                      </div>

                      {/* ── UPDATE CONTROL / MANUAL CHECK BANNER ── */}
                      {updateDownloaded ? (
                        <div style={{
                          marginTop: 12,
                          background: 'rgba(76, 175, 80, 0.08)',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                          borderRadius: 12,
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                        }}>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
                              Update v{updateDownloaded.version} Ready
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', marginTop: 3, lineHeight: 1.45 }}>
                              Click to restart Edge-Drop and apply the update.
                            </div>
                          </div>
                          <button
                            onClick={() => window.edge.installUpdate()}
                            style={{
                              width: '100%',
                              background: '#ffffff',
                              color: '#000000',
                              border: 'none',
                              borderRadius: 9,
                              padding: '8px 16px',
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'center',
                              boxShadow: '0 2px 8px rgba(255, 255, 255, 0.15)',
                              transition: 'opacity 0.15s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92' }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                          >
                            Restart to Update
                          </button>
                        </div>
                      ) : !autoUpdates ? (
                        <div style={{
                          marginTop: 12,
                          background: 'rgba(255, 255, 255, 0.035)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 12,
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)'
                        }}>
                          {checkState.status === 'idle' && (
                            <button
                              onClick={handleManualCheck}
                              style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.07)',
                                color: '#ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.14)',
                                borderRadius: 10,
                                padding: '9px 16px',
                                fontSize: 12.5,
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)'
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'
                              }}
                            >
                              Check for updates
                            </button>
                          )}

                          {checkState.status === 'checking' && (
                            <div style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '6px 0' }}>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                style={{
                                  display: 'inline-block',
                                  width: 13,
                                  height: 13,
                                  border: '2px solid rgba(255, 255, 255, 0.25)',
                                  borderTopColor: '#ffffff',
                                  borderRadius: '50%'
                                }}
                              />
                              Checking GitHub for updates...
                            </div>
                          )}

                          {checkState.status === 'up-to-date' && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                              <div style={{ fontSize: 12.5, color: '#4caf50', fontWeight: 500 }}>
                                ✓ Edge-Drop is up to date (v{currentVersion || '0.2.1'})
                              </div>
                              <button
                                onClick={handleManualCheck}
                                style={{
                                  background: 'transparent',
                                  color: 'rgba(255, 255, 255, 0.65)',
                                  border: 'none',
                                  fontSize: 11.5,
                                  cursor: 'pointer',
                                  textDecoration: 'underline'
                                }}
                              >
                                Check again
                              </button>
                            </div>
                          )}

                          {checkState.status === 'available' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <div>
                                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
                                  Edge-Drop v{checkState.version} is available!
                                </div>
                                <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.65)', marginTop: 3, lineHeight: 1.45 }}>
                                  A newer version is ready on GitHub. Would you like to download and update now?
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                                <button
                                  onClick={handleStartDownload}
                                  style={{
                                    background: '#ffffff',
                                    color: '#000000',
                                    border: 'none',
                                    borderRadius: 9,
                                    padding: '7px 16px',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.15)',
                                    transition: 'transform 0.15s ease, opacity 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92' }}
                                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                                >
                                  Download & Update
                                </button>
                                <button
                                  onClick={() => {
                                    useStore.getState().dismissUpdate()
                                    setCheckState({ status: 'idle' })
                                  }}
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.14)',
                                    borderRadius: 9,
                                    padding: '7px 14px',
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)' }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)' }}
                                >
                                  Skip
                                </button>
                              </div>
                            </div>
                          )}

                          {checkState.status === 'downloading' && (
                            <div style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                style={{
                                  display: 'inline-block',
                                  width: 13,
                                  height: 13,
                                  border: '2px solid rgba(255, 255, 255, 0.25)',
                                  borderTopColor: '#ffffff',
                                  borderRadius: '50%'
                                }}
                              />
                              Downloading update package in background...
                            </div>
                          )}

                          {checkState.status === 'error' && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                              <div style={{ fontSize: 12, color: '#f44336' }}>
                                ⚠️ {checkState.error || 'Update check failed'}
                              </div>
                              <button
                                onClick={handleManualCheck}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.12)',
                                  color: '#ffffff',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: 7,
                                  padding: '4px 10px',
                                  fontSize: 11.5,
                                  cursor: 'pointer'
                                }}
                              >
                                Try again
                              </button>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </>
                  )}

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
                          onClick={() => { playButtonClickSound(); patch({ autoDeleteHours: opt.val }) }}
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
                          onClick={() => { playButtonClickSound(); patch({ historyLimit: opt.val }) }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {PersistentFooter}
                </motion.div>
              )}

              {/* ── Tab 2: Position (Second) ─────────────────────────────── */}
              {activeTab === 'position' && (
                <motion.div
                  key="tab-position"
                  initial={{ opacity: 0, scale: 0.98, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* ── GROUP: Position ──────────────────────────────────── */}
                  <div className="setting-group-label">Position</div>

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
                          onClick={() => {
                            playButtonClickSound()
                            patch({ stickPosition: opt.val })
                            useStore.getState().notifyPositionChanged()
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="setting-divider" />

                  {/* Vertical Position Range Slider */}
                  <div className="setting-row vertical" style={{ gap: 10 }}>
                    <div className="setting-slider-header">
                      <div className="setting-info">
                        <div className="setting-title">Vertical position</div>
                        <div className="setting-desc">Vertical alignment of the shelf along the screen edge</div>
                      </div>
                      <div className="setting-slider-val">
                        {`${Math.round((settings.verticalOffset ?? 0.5) * 100)}%`}
                      </div>
                    </div>

                    <div className="setting-slider-wrap">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.002"
                        className="setting-range-input"
                        value={settings.verticalOffset ?? 0.5}
                        style={{
                          background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(settings.verticalOffset ?? 0.5) * 100}%, rgba(255, 255, 255, 0.12) ${(settings.verticalOffset ?? 0.5) * 100}%, rgba(255, 255, 255, 0.12) 100%)`
                        }}
                        onPointerDown={() => {
                          void window.edge.setInteractive(true)
                          setSliderActive(true)
                        }}
                        onPointerUp={(e) => {
                          setSliderActive(false)
                          const val = parseFloat((e.target as HTMLInputElement).value)
                          handleSliderRelease(val)
                        }}
                        onPointerCancel={(e) => {
                          setSliderActive(false)
                          const val = parseFloat((e.target as HTMLInputElement).value)
                          handleSliderRelease(val)
                        }}
                        onLostPointerCapture={(e) => {
                          setSliderActive(false)
                          const val = parseFloat((e.target as HTMLInputElement).value)
                          handleSliderRelease(val)
                        }}
                        onChange={(e) => {
                          const raw = parseFloat(e.target.value)
                          handleSliderInput(raw)
                        }}
                      />

                      <div className="setting-slider-ticks">
                        {Array.from({ length: 21 }, (_, i) => {
                          const tickVal = i * 0.05
                          const currentVal = settings.verticalOffset ?? 0.5
                          const isMajor = i === 0 || i === 10 || i === 20
                          const isActive = Math.abs(currentVal - tickVal) < 0.025
                          return (
                            <span
                              key={i}
                              className={`slider-tick${isMajor ? ' major' : ''}${isActive ? ' active' : ''}`}
                            />
                          )
                        })}
                      </div>

                      <div className="setting-slider-labels">
                        {[
                          { label: '0%', val: 0 },
                          { label: '50%', val: 0.5 },
                          { label: '100%', val: 1.0 }
                        ].map((pos) => {
                          const currentVal = settings.verticalOffset ?? 0.5
                          const active = Math.abs(currentVal - pos.val) < 0.04
                          return (
                            <button
                              key={pos.val}
                              type="button"
                              className={`slider-label-btn${active ? ' active' : ''}`}
                              onClick={() => handleSliderRelease(pos.val)}
                            >
                              {pos.label}
                            </button>
                          )
                        })}
                      </div>
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
                            onClick={() => {
                              playButtonClickSound()
                              patch({ stickDisplayId: d.id })
                              useStore.getState().notifyPositionChanged()
                            }}
                          >
                            <div className="pill-name">{d.name}</div>
                            <div className="pill-res">{d.resolution}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* ── GROUP: Trigger Zone ──────────────────────────────── */}
                  <div className="setting-group-label" style={{ marginTop: 20 }}>Trigger Zone</div>

                  <div className="setting-row">
                    <div className="setting-info">
                      <div className="setting-title">Edge location hint</div>
                      <div className="setting-desc">Subtly illuminate beacon on screen edge when touching edge at wrong position</div>
                    </div>
                    <Toggle
                      checked={settings.showEdgeLocationHint ?? true}
                      onChange={(v) => patch({ showEdgeLocationHint: v })}
                    />
                  </div>

                  <div className="setting-divider" />

                  <div className="setting-row vertical">
                    <div className="setting-info">
                      <div className="setting-title">Edge trigger position</div>
                      <div className="setting-desc">Placement of hover trigger strip relative to shelf</div>
                    </div>
                    <div className="setting-pills">
                      {[
                        { label: 'Top', val: 'top' as const },
                        { label: 'Center', val: 'center' as const },
                        { label: 'Bottom', val: 'bottom' as const }
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          className={`pill ${(settings.triggerAlignment || 'center') === opt.val ? 'active' : ''}`}
                          onClick={() => {
                            playButtonClickSound()
                            patch({ triggerAlignment: opt.val })
                            useStore.getState().notifyPositionChanged()
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="setting-divider" />

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
                          onClick={() => {
                            playButtonClickSound()
                            patch({ hotZoneHeight: opt.val })
                          }}
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
                          onClick={() => {
                            playButtonClickSound()
                            patch({ hotZoneWidth: opt.val })
                          }}
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
                          onClick={() => {
                            playButtonClickSound()
                            patch({ panelHeight: opt.val })
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {PersistentFooter}
                </motion.div>
              )}

              {/* ── Tab 3: Appearance (Third) ────────────────────────────── */}
              {activeTab === 'appearance' && (
                <motion.div
                  key="tab-appearance"
                  initial={{ opacity: 0, scale: 0.98, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* ── GROUP: Copy Indicator ────────────────────────────── */}
                  <div className="setting-group-label">Copy Indicator</div>

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
                          onClick={() => {
                            playButtonClickSound()
                            handleToggleFlyout()
                          }}
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
                              onClick={() => {
                                playButtonClickSound()
                                patch({ copyIndicatorStyle: 'logo' })
                              }}
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
                              onClick={() => {
                                playButtonClickSound()
                                patch({ copyIndicatorStyle: 'check' })
                              }}
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
                              onClick={() => {
                                playButtonClickSound()
                                patch({ copyIndicatorStyle: 'copy' })
                              }}
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
                              onClick={() => {
                                playButtonClickSound()
                                patch({ copyIndicatorStyle: 'sparkle' })
                              }}
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

                  {/* ── GROUP: Typography ────────────────────────────────── */}
                  <div className="setting-group-label" style={{ marginTop: 20 }}>Typography</div>

                  <div className="setting-row vertical">
                    <div className="setting-info">
                      <div className="setting-title">Text size</div>
                      <div className="setting-desc">Adjust UI typography scale across Edge-Drop</div>
                    </div>
                    <div className="setting-pills">
                      {[
                        { label: 'Small', val: 0.85 },
                        { label: 'Normal', val: 1.0 },
                        { label: 'Large', val: 1.15 }
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          className={`pill ${Math.abs((settings.fontSizeScale ?? 1.0) - opt.val) < 0.05 ? 'active' : ''}`}
                          onClick={() => {
                            playButtonClickSound()
                            patch({ fontSizeScale: opt.val })
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="setting-divider" />

                  {/* ── GROUP: Audio & Feedback ──────────────────────────── */}
                  <div className="setting-group-label" style={{ marginTop: 20 }}>Audio & Feedback</div>

                  <div className="setting-row">
                    <div className="setting-info">
                      <div className="setting-title">Sound effects</div>
                      <div className="setting-desc">Tactile audio feedback for sliders, buttons, and switches</div>
                    </div>
                    <Toggle
                      checked={settings.soundEffects ?? true}
                      onChange={(v) => {
                        if (v) playToggleSound(true)
                        patch({ soundEffects: v })
                      }}
                    />
                  </div>

                  {PersistentFooter}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Toggle({
  checked,
  onChange,
  disabled
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      className={`setting-toggle${checked ? ' checked' : ''}`}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        playToggleSound(!checked)
        onChange(!checked)
      }}
      style={{
        flexShrink: 0,
        width: 38,
        height: 22,
        borderRadius: 999,
        background: disabled ? 'rgba(255, 255, 255, 0.05)' : checked ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
        border: disabled ? '1px solid rgba(255, 255, 255, 0.08)' : checked ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 0,
        outline: 'none',
        transition: 'background 0.22s ease, border-color 0.22s ease',
        boxShadow: !disabled && checked ? '0 0 12px rgba(255, 255, 255, 0.25)' : 'none',
        opacity: disabled ? 0.45 : 1
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
