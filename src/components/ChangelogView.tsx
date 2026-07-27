import { useEffect, useState } from 'react'
import { useStore } from '../store/appStore'

interface HighlightItem {
  title: string
  description: string
}

interface ChangelogRelease {
  version: string
  date: string
  isLatest: boolean
  summary: string
  highlights: HighlightItem[]
}

const CHANGELOG_DATA: ChangelogRelease[] = [
  {
    version: 'v0.2.0',
    date: 'Jul 26, 2026',
    isLatest: true,
    summary: 'Silent background auto-updater, direct web link launcher, dedicated Pinned items deck, and interactive controls.',
    highlights: [
      {
        title: 'Silent Background Auto-Updates',
        description: 'New updates download silently in the background with a single-click Restart to Update button.'
      },
      {
        title: 'Direct One-Click Web Link Launcher',
        description: 'Copied links feature a dedicated launch button opening directly in your default browser.'
      },
      {
        title: 'Dedicated Pinned Items Deck',
        description: 'Encapsulated pinned items inside a dedicated deck container at the top of the shelf.'
      },
      {
        title: 'Live What\'s New Sync',
        description: 'Release history connects live to GitHub Releases with automatic offline safeguards.'
      }
    ]
  },
  {
    version: 'v0.1.5',
    date: 'Jul 24, 2026',
    isLatest: false,
    summary: 'Customizable Copy Indicator styles with a 2x2 grid selector flyout alongside panel hover stability fixes for medium and large panel heights.',
    highlights: [
      {
        title: 'Four Vector Indicator Options',
        description: 'Added support for 4 customizable copy indicator styles including Logo, Tick, Copy, and Sparkle.'
      },
      {
        title: 'Balanced 2x2 Grid Flyout Selector',
        description: 'Integrated a 2x2 grid selector flyout inside Settings under Indicator Style for quick style previews and one-click selection.'
      },
      {
        title: 'Clean Vector Graphic Rendering',
        description: 'Removed background circle badges so all icons float natively as solid vector graphics with subtle glowing drop shadows.'
      },
      {
        title: 'Panel Hover Boundary Fix for Settings Button',
        description: 'Resolved an issue where moving the cursor down toward the Settings button on medium (60%) and large (80%) panel heights caused the clipboard to prematurely close.'
      },
      {
        title: 'Recalibrated Y-Axis Hot Zone',
        description: 'Updated the panel height bounds calculation in the edge hover detector so the entire vertical area of the expanded blade remains active.'
      }
    ]
  },
  {
    version: 'v0.1.4',
    date: 'Jul 23, 2026',
    isLatest: false,
    summary: 'Automatic Fullscreen Protection for gamers and presenters - detecting Direct3D games and fullscreen media via native Windows APIs.',
    highlights: [
      {
        title: 'Automatic OS Game & Fullscreen Detection',
        description: 'Integrated native Windows API detection to identify Direct3D fullscreen games, presentation modes, and busy states.'
      },
      {
        title: 'Hover Suppression & Instant Auto-Retract',
        description: 'Automatically suppresses edge hover and instantly retracts the panel when a fullscreen game, video, or presentation is active in the foreground.'
      },
      {
        title: '0ms Latency & Hotkey Access',
        description: 'Background polling runs every 1 second with 0ms overhead during edge hover checks. Global shortcut Alt + C remains active.'
      },
      {
        title: 'Settings Toggle (Fullscreen Protection)',
        description: 'Added a user toggle under Behaviour in Settings (Fullscreen Protection, enabled by default).'
      },
      {
        title: 'GitHub Support & Feedback Links',
        description: 'Added a COMMUNITY & SUPPORT section in Settings linking directly to bug reports and feature requests.'
      }
    ]
  },
  {
    version: 'v0.1.3',
    date: 'Jul 23, 2026',
    isLatest: false,
    summary: 'Major multi-display architecture overhaul featuring single-source display selection, System Tray sync, and automatic OS disconnect recovery.',
    highlights: [
      {
        title: 'Single-Source Display Engine & Real-Time Tray Sync',
        description: 'Unified monitor listing and selection state across Application Settings and the System Tray context menu into a single source of truth.'
      },
      {
        title: 'Automatic OS Disconnect Recovery',
        description: 'When a secondary display hosting the panel is disconnected, Edge-Drop auto-heals its target back to the Primary Display.'
      },
      {
        title: 'Brief Visual Confirmation Pop-Ups',
        description: 'The clipboard panel automatically pops open for 1.5 seconds to visually confirm its position whenever a monitor configuration changes.'
      },
      {
        title: 'Universal Flyout Click-to-Paste',
        description: 'Clicking any text snippet, image thumbnail, or file tile inside an open Preview Flyout now instantly pastes that item into active applications.'
      },
      {
        title: 'Animation Controls',
        description: 'Added independent settings under Animations for bounce scale pop (bounceAnimation) and background blurring (blurAnimation).'
      }
    ]
  },
  {
    version: 'v0.1.2',
    date: 'Jul 22, 2026',
    isLatest: false,
    summary: 'Security infrastructure upgrades including Windows DPAPI history encryption, process isolation, Electron 34, and Preview Flyout drag-to-stack.',
    highlights: [
      {
        title: 'Windows DPAPI safeStorage Encryption & Electron 34',
        description: 'Clipboard history is now encrypted at rest using native Windows DPAPI. Core runtime upgraded to Electron v34.2.0.'
      },
      {
        title: 'Preview Flyout Drag-to-Stack Merging',
        description: 'You can drag any item from the clipboard shelf directly onto an open Preview Flyout to stack and merge items instantly.'
      },
      {
        title: 'Dynamic 100% Full-Width Single-File Layout',
        description: 'Opening the Preview Flyout for a single file dynamically expands to a full-width presentation.'
      },
      {
        title: 'Unified Image File Rendering',
        description: 'Images copied from File Explorer or desktop automatically render as rich visual image cards with thumbnails.'
      }
    ]
  },
  {
    version: 'v0.1.1',
    date: 'Jul 18, 2026',
    isLatest: false,
    summary: 'Multi-monitor configuration, screen edge selection (Left/Right), and background memory optimizations.',
    highlights: [
      {
        title: 'Multi-Monitor & Position Support',
        description: 'Targeted display selection allows anchoring to any connected monitor on either Left or Right screen edge.'
      },
      {
        title: 'Resource & Memory Optimization',
        description: 'Rebuilt image handling consuming up to 60% less RAM while idle.'
      },
      {
        title: 'Bug Fixes & UI Refinements',
        description: 'Display highlight accuracy defaults to primary display and Z-index rendering fixes.'
      }
    ]
  },
  {
    version: 'v0.1.0',
    date: 'Jul 10, 2026',
    isLatest: false,
    summary: 'Initial release of Edge-Drop, a zero-click desktop clipboard shelf living on the screen edge.',
    highlights: [
      {
        title: 'Zero-Click Activation & Edge Hover',
        description: 'Anchored at the screen edge with 120ms dwelling detection and physics-based spring panel opening.'
      },
      {
        title: 'OS-Level OLE Native Drag & Drop',
        description: 'Drag items directly into Photoshop, Word, Slack, or File Explorer.'
      },
      {
        title: 'Fluid Collections & 3D Stacks',
        description: 'Multi-file copies auto-group into expandable 3D card stacks.'
      },
      {
        title: 'Configurable Clipboard Engine',
        description: 'Incognito Mode, customizable history capacity (100-1000 items), auto-delete timers, and vertical trigger hot-zones.'
      }
    ]
  }
]

export function ChangelogView() {
  const currentVersion = useStore((s) => s.currentVersion)
  const [releases, setReleases] = useState<ChangelogRelease[]>(CHANGELOG_DATA)

  useEffect(() => {
    window.edge.getReleases()
      .then((fetched) => {
        if (Array.isArray(fetched) && fetched.length > 0) {
          setReleases(fetched)
        }
      })
      .catch((err) => {
        console.warn('Failed to load live GitHub releases:', err)
      })
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '16px',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#ffffff'
    }}>
      {releases.map((rel, index) => {
        const isCurrent = currentVersion ? `v${currentVersion}` === rel.version || currentVersion === rel.version : rel.isLatest

        return (
          <div
            key={rel.version}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '100%',
              overflowX: 'hidden',
              paddingBottom: index < CHANGELOG_DATA.length - 1 ? '24px' : '0',
              borderBottom: index < CHANGELOG_DATA.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
            }}
          >
            {/* Version Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: 'Consolas, "Cascadia Code", monospace',
                  letterSpacing: '-0.02em'
                }}>
                  {rel.version}
                </span>
                {isCurrent && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.75)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    flexShrink: 0
                  }}>
                    LATEST
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400, flexShrink: 0 }}>
                {rel.date}
              </span>
            </div>

            {/* Summary */}
            <p style={{
              fontSize: '13px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.75)',
              margin: 0,
              fontWeight: 400,
              overflowWrap: 'break-word',
              wordBreak: 'break-word'
            }}>
              {rel.summary}
            </p>

            {/* Highlights Bullet List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              {rel.highlights.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '13px',
                    lineHeight: '1.55',
                    minWidth: 0
                  }}
                >
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.35)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    userSelect: 'none',
                    flexShrink: 0
                  }}>
                    •
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      {item.title}
                    </span>
                    {item.description && (
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12.5px', lineHeight: '1.5', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
