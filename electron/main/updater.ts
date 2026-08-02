import { app } from 'electron'
import { isStoreBuild } from './ipc'
import { pushState } from './state'
import { getSettings } from '../store/settings'

// Module-level reference to the single autoUpdater instance.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _autoUpdater: any = null

/**
 * Called from ipc.ts when the renderer clicks "Restart to Update".
 */
export function quitAndInstallUpdate(): void {
  if (isStoreBuild()) return
  if (!_autoUpdater) {
    console.error('[AutoUpdater] quitAndInstall requested but autoUpdater is not initialized.')
    return
  }
  if (!app.isPackaged) {
    console.log('[AutoUpdater] Dev mode — quitAndInstall is a no-op here. Works in packaged builds.')
    return
  }
  console.log('[AutoUpdater] quitAndInstall triggered by renderer button.')
  _autoUpdater.quitAndInstall(false, true)
}

/**
 * Syncs the autoDownload flag on electron-updater whenever user changes settings.
 */
export function syncAutoUpdaterState(): void {
  if (isStoreBuild() || !_autoUpdater) return
  const settings = getSettings()
  const enabled = settings.autoUpdates !== false
  _autoUpdater.autoDownload = enabled
  _autoUpdater.autoInstallOnAppQuit = enabled
  console.log('[AutoUpdater] Synced autoDownload =', enabled)
}

/**
 * Manually check for updates on user click.
 */
export async function checkForUpdatesManual(): Promise<{ status: string; version?: string; error?: string }> {
  if (isStoreBuild()) {
    return { status: 'up-to-date', version: app.getVersion() }
  }
  if (!_autoUpdater) {
    try {
      const { autoUpdater } = require('electron-updater')
      _autoUpdater = autoUpdater
    } catch (err: any) {
      return { status: 'error', error: err?.message || 'AutoUpdater not initialized' }
    }
  }

  try {
    // Strictly disable autoDownload for manual checks so it only downloads on explicit user click!
    _autoUpdater.autoDownload = false
    _autoUpdater.autoInstallOnAppQuit = false
    const result = await _autoUpdater.checkForUpdates()
    if (result && result.updateInfo && result.updateInfo.version !== app.getVersion()) {
      return { status: 'available', version: result.updateInfo.version }
    }
    return { status: 'up-to-date', version: app.getVersion() }
  } catch (err: any) {
    return { status: 'error', error: typeof err === 'string' ? err : err?.message || 'Failed to check for updates' }
  }
}

/**
 * Trigger download of the update when user clicks "Download & Update" in manual mode.
 */
export async function startUpdateDownload(): Promise<void> {
  if (isStoreBuild() || !_autoUpdater) return
  try {
    await _autoUpdater.downloadUpdate()
  } catch (err) {
    console.error('[AutoUpdater] downloadUpdate failed:', err)
  }
}

/**
 * Initializes electron-updater for GitHub release auto-updates.
 * Completely disabled on Microsoft Store (MSIX) builds to comply with Store policies.
 */
export function initAutoUpdater(): void {
  if (isStoreBuild()) {
    console.log('[AutoUpdater] Store build detected — auto-updater disabled.')
    return
  }

  try {
    const { autoUpdater } = require('electron-updater')
    _autoUpdater = autoUpdater

    const settings = getSettings()
    const autoUpdatesEnabled = settings.autoUpdates !== false

    autoUpdater.logger = console
    autoUpdater.autoDownload = autoUpdatesEnabled
    autoUpdater.autoInstallOnAppQuit = autoUpdatesEnabled

    if (!app.isPackaged) {
      console.log('[AutoUpdater] Unpackaged dev build detected — enabling forceDevUpdateConfig')
      autoUpdater.forceDevUpdateConfig = true
    }

    autoUpdater.on('checking-for-update', () => {
      console.log('[AutoUpdater] Checking for update... Current version:', app.getVersion())
    })

    autoUpdater.on('update-available', (info: { version: string }) => {
      console.log('[AutoUpdater] New update available on GitHub:', info.version)
      pushState.updateAvailable({ version: info.version })
    })

    autoUpdater.on('update-not-available', (info: { version: string }) => {
      console.log('[AutoUpdater] App is up to date. Latest release:', info.version, 'Current:', app.getVersion())
    })

    autoUpdater.on('update-downloaded', (info: { version: string }) => {
      console.log('[AutoUpdater] Update downloaded and ready to install:', info.version)
      pushState.updateDownloaded({ version: info.version })
    })

    autoUpdater.on('error', (err: Error | string) => {
      const msg = typeof err === 'string' ? err : err?.message
      console.warn('[AutoUpdater] Update check error:', msg)
    })

    // Initiate background update check ONLY if autoUpdates is enabled!
    if (autoUpdatesEnabled) {
      setTimeout(() => {
        autoUpdater.checkForUpdates().catch((err: Error | string) => {
          const msg = typeof err === 'string' ? err : err?.message
          console.warn('[AutoUpdater] checkForUpdates failed:', msg)
        })
      }, 3000)
    } else {
      console.log('[AutoUpdater] Automatic updates disabled by user setting. Staying network-silent on startup.')
    }
  } catch (err) {
    console.error('[AutoUpdater] Initialization failed:', err)
  }
}
