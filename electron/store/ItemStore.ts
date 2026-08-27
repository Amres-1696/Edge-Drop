/**
 * In-memory + on-disk store for clipboard history.
 *
 * Responsibilities:
 *   - Keep an ordered list (most recent first) of ClipboardItem.
 *   - Deduplicate by content signature so re-copies bump `hitCount` instead of
 *     adding a clone.
 *   - Enforce a size cap, evicting the oldest *unpinned* items.
 *   - Persist the index to JSON and image bytes to per-item PNG files.
 *   - Convert internal items to the serializable DTO form for the renderer.
 */
import { existsSync, readFileSync, writeFileSync, renameSync, rmSync, statSync, readdirSync } from 'node:fs'
import { join, extname, basename as pathBasename } from 'node:path'
import { createHash } from 'node:crypto'
import { nativeImage, safeStorage } from 'electron'
import { thumbnailUrlForFile, thumbnailUrlForStoredImage } from '../main/imageProtocol'
import {
  type ClipboardItem,
  type ClipboardItemDto,
  type DragRequest,
  type ItemData,
  type MergeResult,
  type FileEntry,
  MAX_STACK
} from '../../shared/types'
import { PATHS } from './paths'
import { createId } from './ids'

/** Stable, compact content hash used for text deduplication. */
function textContentHash(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

/** Stable, content-based key used for deduplication. */
function signature(data: ItemData): string {
  switch (data.kind) {
    case 'text':
      return `text|${data.contentHash ?? textContentHash(data.text)}`
    case 'image':
      return `image|${data.imageId}`
    case 'image-collection':
      return `image-collection|${data.images.map((i) => i.imageId).join(',')}`
    case 'files':
      return `files|${data.paths.join('\n')}`
  }
}

/** Maps a signature -> item id so dedup is O(1). */
interface Index {
  items: ClipboardItem[]
}

export class ItemStore {
  private items: ClipboardItem[] = []
  private sigToId = new Map<string, string>()
  /** Prevents a transient DPAPI/read failure from overwriting the user's index. */
  private persistenceBlocked = false
  /** Assets evicted by the history cap; removed only after the new index is durable. */
  private pendingCleanup: ClipboardItem[] = []
  /** Small, bounded thumbnails for renderer DTOs. Original image bytes stay on disk. */
  private previewCache = new Map<string, string>()

  /** Load persisted state from disk. Called once at startup. */
  load(): void {
    this.persistenceBlocked = false
    try {
      const file = PATHS.indexFile()
      if (!existsSync(file)) {
        this.items = []
        this.rebuildIndex()
        return
      }

      const rawBuffer = readFileSync(file)
      const rawStr = rawBuffer.toString('utf8').trim()
      let parsedIndex: Index | null = null
      let needsMigration = false

      let parsedJson: any = null
      try {
        parsedJson = JSON.parse(rawStr)
      } catch {
        /* Raw non-JSON payload */
      }

      if (parsedJson && parsedJson.encrypted === true && typeof parsedJson.payload === 'string') {
        // Encrypted DPAPI Envelope
        if (safeStorage.isEncryptionAvailable()) {
          try {
            const decryptedStr = safeStorage.decryptString(Buffer.from(parsedJson.payload, 'base64'))
            parsedIndex = JSON.parse(decryptedStr) as Index
          } catch (err) {
            console.error('[ItemStore] DPAPI decryption failed:', err)
            this.persistenceBlocked = true
          }
        } else {
          console.warn('[ItemStore] safeStorage unavailable to decrypt items.json')
          this.persistenceBlocked = true
        }
      } else if (parsedJson && Array.isArray(parsedJson.items)) {
        // Plain JSON (Legacy v0.1.1 format from active users)
        parsedIndex = parsedJson as Index
        needsMigration = true
      }

      if (parsedIndex && Array.isArray(parsedIndex.items)) {
        this.items = parsedIndex.items.filter((it) => it && it.data && typeof it.id === 'string')

        // Auto-migrate large text items to disk payload files. Persist a compact
        // content hash as well: after restart only the preview remains in the
        // index, so hashing preview text would break full-text deduplication.
        let migratedAnyPayloads = false
        for (const it of this.items) {
          if (it.data.kind !== 'text') continue
          let fullText = it.data.text
          if (!it.data.hasFullPayload && fullText.length > 300) {
            if (this.writeTextPayload(it.id, fullText)) {
              it.data.hasFullPayload = true
              it.data.previewText = fullText.slice(0, 300)
              it.data.text = it.data.previewText
              migratedAnyPayloads = true
            }
          } else if (it.data.hasFullPayload) {
            const payload = this.readTextPayload(it.id)
            if (payload) {
              fullText = payload.text
              // Upgrade the initial upstream plaintext payload format to DPAPI.
              if (safeStorage.isEncryptionAvailable() && !payload.encrypted && this.writeTextPayload(it.id, fullText)) {
                migratedAnyPayloads = true
              }
            }
          }
          const contentHash = textContentHash(fullText)
          if (it.data.contentHash !== contentHash) {
            it.data.contentHash = contentHash
            migratedAnyPayloads = true
          }
        }

        this.rebuildIndex()

        // Auto-migrate legacy plain JSON: create backup & upgrade to DPAPI encryption
        if (needsMigration || migratedAnyPayloads) {
          console.log('[ItemStore] Migrating items.json to DPAPI safeStorage encryption and disk payloads...')
          try {
            const backupFile = `${file}.v1.bak`
            if (!existsSync(backupFile)) {
              writeFileSync(backupFile, rawBuffer)
            }
            this.persist()
          } catch (err) {
            console.error('[ItemStore] Auto-migration backup/persist failed:', err)
          }
        }
      } else {
        console.warn('[ItemStore] Index file could not be parsed; preserving data without wiping')
        this.persistenceBlocked = true
        const backupFile = `${file}.corrupted.${Date.now()}`
        try { writeFileSync(backupFile, rawBuffer) } catch { /* ignore */ }
      }
    } catch (err) {
      console.error('[ItemStore] Failed to load index file:', err)
      this.items = []
      this.sigToId.clear()
    }
  }

  private rebuildIndex(): void {
    this.sigToId.clear()
    for (const it of this.items) this.sigToId.set(signature(it.data), it.id)
  }

  private persistTimer: ReturnType<typeof setTimeout> | null = null

  /** Persist the current index to disk. Debounced to prevent main thread blocking during UI transitions. */
  private persist(): void {
    if (this.persistTimer) {
      clearTimeout(this.persistTimer)
    }
    this.persistTimer = setTimeout(() => {
      this.persistTimer = null
      this.persistSync()
    }, 150)
  }

  /** Synchronous disk write (called by debounced timer or on app shutdown). */
  public persistSync(): boolean {
    if (this.persistTimer) {
      clearTimeout(this.persistTimer)
      this.persistTimer = null
    }
    if (this.persistenceBlocked) {
      console.error('[ItemStore] Persistence blocked because the existing index could not be safely loaded')
      return false
    }
    try {
      const indexObj: Index = { items: this.items }
      const jsonStr = JSON.stringify(indexObj)
      const file = PATHS.indexFile()

      if (safeStorage.isEncryptionAvailable()) {
        const encryptedBuf = safeStorage.encryptString(jsonStr)
        const envelope = {
          v: 2,
          encrypted: true,
          payload: encryptedBuf.toString('base64')
        }
        this.writeIndexAtomically(file, JSON.stringify(envelope, null, 2))
      } else {
        this.writeIndexAtomically(file, JSON.stringify(indexObj, null, 2))
      }
      const cleanup = this.pendingCleanup.splice(0)
      cleanup.forEach((item) => this.cleanupItemAssets(item))
      return true
    } catch (err) {
      console.error('[ItemStore] Persistence failed:', err)
      return false
    }
  }

  private writeIndexAtomically(file: string, contents: string): void {
    const temp = `${file}.tmp`
    try {
      writeFileSync(temp, contents, 'utf8')
      renameSync(temp, file)
    } catch (error) {
      try { rmSync(temp, { force: true }) } catch { /* ignore */ }
      throw error
    }
  }

  private cleanupItemAssets(item: ClipboardItem): void {
    const imageReferenced = (imageId: string) => this.items.some((current) => {
      if (current.data.kind === 'image') return current.data.imageId === imageId
      if (current.data.kind === 'image-collection') return current.data.images.some((image) => image.imageId === imageId)
      return false
    })
    if (item.data.kind === 'image' && !imageReferenced(item.data.imageId)) {
      this.removeImageFile(item.data.imageId)
    }
    if (item.data.kind === 'image-collection') {
      item.data.images.forEach((img) => {
        if (!imageReferenced(img.imageId)) this.removeImageFile(img.imageId)
      })
    }
    if (item.data.kind === 'text') this.removeTextPayload(item.id)
  }

  /**
   * Enforce the size cap by evicting oldest *unpinned* items. Walks from the
   * tail (oldest) forward, skipping anything pinned so favorites survive.
   */
  private trim(limit: number): void {
    if (this.items.length <= limit) return
    const need = this.items.length - limit
    const survivors: ClipboardItem[] = []
    let stillNeed = need
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i]
      if (stillNeed > 0 && !it.pinned) {
        this.sigToId.delete(signature(it.data))
        this.pendingCleanup.push(it)
        stillNeed--
      } else {
        survivors.unshift(it)
      }
    }
    this.items = survivors
  }

  /**
   * Add or refresh a piece of content.
   * Returns true if the list actually changed (so callers can decide to push).
   */
  add(data: ItemData, limit: number): boolean {
    if (this.persistenceBlocked) return false
    if (data.kind === 'text' && data.text.length > 500000) {
      data = { ...data, text: data.text.slice(0, 500000) }
    }
    const sig = signature(data)
    const existingId = this.sigToId.get(sig)
    const now = Date.now()

    if (existingId) {
      const idx = this.items.findIndex((it) => it.id === existingId)
      if (idx >= 0) {
        const it = this.items[idx]
        // Bump count and move to front.
        const updated: ClipboardItem = { ...it, hitCount: it.hitCount + 1, capturedAt: now }
        this.items.splice(idx, 1)
        this.items.unshift(updated)
        this.persist()
        return true
      }
    }

    const id = createId()
    let finalData = data
    if (data.kind === 'text' && data.text.length > 300) {
      if (this.writeTextPayload(id, data.text)) {
        finalData = {
          ...data,
          hasFullPayload: true,
          previewText: data.text.slice(0, 300),
          text: data.text.slice(0, 300),
          contentHash: textContentHash(data.text)
        }
      }
    }

    if (finalData.kind === 'text' && !finalData.contentHash) {
      finalData = { ...finalData, contentHash: textContentHash(finalData.text) }
    }
    const item: ClipboardItem = { id, data: finalData, capturedAt: now, hitCount: 1, pinned: false }
    this.items.unshift(item)
    this.sigToId.set(sig, id)
    if (data.kind === 'image') this.writeImageFile(data.imageId)
    this.trim(limit)
    this.persist()
    return true
  }

  setPinned(id: string, pinned: boolean): void {
    if (this.persistenceBlocked) return
    const it = this.items.find((x) => x.id === id)
    if (!it) return
    it.pinned = pinned
    this.persist()
  }

  delete(id: string): boolean {
    const idx = this.items.findIndex((x) => x.id === id)
    if (idx < 0) return false
    const [removed] = this.items.splice(idx, 1)
    this.sigToId.delete(signature(removed.data))
    if (!this.persistSync()) {
      this.items.splice(idx, 0, removed)
      this.rebuildIndex()
      return false
    }
    this.cleanupItemAssets(removed)
    return true
  }

  deleteBatch(ids: string[]): boolean {
    if (!ids || ids.length === 0) return true
    const previousItems = this.items
    const set = new Set(ids)
    const toRemove: ClipboardItem[] = []
    this.items = this.items.filter((it) => {
      if (set.has(it.id)) {
        toRemove.push(it)
        return false
      }
      return true
    })

    this.rebuildIndex()
    if (!this.persistSync()) {
      this.items = previousItems
      this.rebuildIndex()
      return false
    }
    toRemove.forEach((item) => this.cleanupItemAssets(item))
    return true
  }

  merge(sourceId: string, targetId: string): MergeResult {
    if (this.persistenceBlocked) return { ok: false, reason: 'notfound', message: 'Clipboard storage is temporarily read-only' }
    if (sourceId === targetId) return { ok: false }
    const srcIdx = this.items.findIndex(x => x.id === sourceId)
    const tgtIdx = this.items.findIndex(x => x.id === targetId)
    if (srcIdx < 0 || tgtIdx < 0) return { ok: false, reason: 'notfound' }

    const src = this.items[srcIdx]
    const tgt = this.items[tgtIdx]

    // Determine how to merge based on kinds
    // 1. Image(s) + Image(s) -> Image Collection / Image File Stack (any screenshot or image file)
    // 2. Files + Files -> Files (any non-image files stack together)

    let newData: ItemData | null = null

    const isImageItem = (item: ClipboardItem): boolean => {
      if (item.data.kind === 'image' || item.data.kind === 'image-collection') return true
      if (item.data.kind === 'files' && item.data.paths.length > 0) {
        return item.data.paths.every((p) => isImageExt(p))
      }
      return false
    }

    const getImagePaths = (item: ClipboardItem): string[] => {
      if (item.data.kind === 'files') return item.data.paths
      if (item.data.kind === 'image') return [this.imagePath(item.data.imageId, item.data.ext)]
      if (item.data.kind === 'image-collection') return item.data.images.map((img) => this.imagePath(img.imageId, img.ext))
      return []
    }

    const srcIsImage = isImageItem(src)
    const tgtIsImage = isImageItem(tgt)

    if (srcIsImage && tgtIsImage) {
      if (src.data.kind !== 'files' && tgt.data.kind !== 'files') {
        const srcData = src.data
        const tgtData = tgt.data
        const srcImages = srcData.kind === 'image-collection' ? srcData.images : srcData.kind === 'image' ? [{ imageId: srcData.imageId, width: srcData.width, height: srcData.height, bytes: srcData.bytes, ext: srcData.ext }] : []
        const tgtImages = tgtData.kind === 'image-collection' ? tgtData.images : tgtData.kind === 'image' ? [{ imageId: tgtData.imageId, width: tgtData.width, height: tgtData.height, bytes: tgtData.bytes, ext: tgtData.ext }] : []
        const seen = new Set(tgtImages.map((i) => i.imageId))
        const combined = [...tgtImages, ...srcImages.filter((i) => !seen.has(i.imageId))]

        if (combined.length > MAX_STACK) return { ok: false, reason: 'full', message: 'An image collection can hold a maximum of 10 items' }
        newData = { kind: 'image-collection', images: combined }
      } else {
        const srcPaths = getImagePaths(src)
        const tgtPaths = getImagePaths(tgt)
        const seen = new Set(tgtPaths)
        const combined = [...tgtPaths, ...srcPaths.filter((p) => !seen.has(p))]

        if (combined.length > MAX_STACK) return { ok: false, reason: 'full', message: 'An image collection can hold a maximum of 10 items' }
        newData = { kind: 'files', paths: combined }
      }
    } else if (src.data.kind === 'files' && tgt.data.kind === 'files') {
      const seen = new Set(tgt.data.paths)
      const combined = [...tgt.data.paths, ...src.data.paths.filter((p) => !seen.has(p))]

      if (combined.length > MAX_STACK) return { ok: false, reason: 'full', message: 'A folder bundle can hold a maximum of 10 files' }
      newData = { kind: 'files', paths: combined }
    }

    if (!newData) {
      if (srcIsImage || tgtIsImage) {
        return { ok: false, reason: 'incompatible', message: 'Images can only be grouped with other images' }
      } else if (src.data.kind === 'files' || tgt.data.kind === 'files') {
        return { ok: false, reason: 'incompatible', message: 'Files can only be grouped with other files' }
      }
      return { ok: false, reason: 'incompatible', message: 'Text and links cannot be grouped together' }
    }

    // Update target item
    this.sigToId.delete(signature(tgt.data))
    tgt.data = newData
    this.sigToId.set(signature(newData), tgt.id)
    tgt.capturedAt = Date.now() // bump time

    // Remove source item completely but DO NOT delete its underlying files/images
    // because they are now owned by the target!
    const [removed] = this.items.splice(srcIdx, 1)
    this.sigToId.delete(signature(removed.data))

    this.persist()
    return { ok: true }
  }

  public removeSubitem(req: DragRequest): boolean {
    if (this.persistenceBlocked) return false
    const sourceItem = this.get(req.id)
    if (!sourceItem) return false
    const sourceIndex = this.items.findIndex(i => i.id === req.id)
    if (sourceIndex === -1) return false

    if (sourceItem.data.kind === 'image-collection' && req.imageId) {
      const imgIdx = sourceItem.data.images.findIndex(i => i.imageId === req.imageId)
      if (imgIdx === -1) return false
      
      sourceItem.data.images.splice(imgIdx, 1)
      
      if (sourceItem.data.images.length === 1) {
        sourceItem.data = { kind: 'image', ...sourceItem.data.images[0] }
      } else if (sourceItem.data.images.length === 0) {
        this.items.splice(sourceIndex, 1)
      }
      this.rebuildIndex()
      this.persist()
      return true
    }

    if (req.paths && req.paths.length > 0 && sourceItem.data.kind === 'files') {
      const targetPaths = req.paths
      sourceItem.data.paths = sourceItem.data.paths.filter(p => !targetPaths.includes(p))
      
      if (sourceItem.data.paths.length === 0) {
        this.items.splice(sourceIndex, 1)
      }
      this.rebuildIndex()
      this.persist()
      return true
    }

    return false
  }

  public split(req: DragRequest): boolean {
    if (this.persistenceBlocked) return false
    const sourceItem = this.get(req.id)
    if (!sourceItem) return false
    const sourceIndex = this.items.findIndex(i => i.id === req.id)
    if (sourceIndex === -1) return false

    // Splitting from an image collection
    if (sourceItem.data.kind === 'image-collection' && req.imageId) {
      const imgIdx = sourceItem.data.images.findIndex(i => i.imageId === req.imageId)
      if (imgIdx === -1) return false
      
      const targetImg = sourceItem.data.images[imgIdx]
      sourceItem.data.images.splice(imgIdx, 1)
      
      if (sourceItem.data.images.length === 1) {
        sourceItem.data = { kind: 'image', ...sourceItem.data.images[0] }
      } else if (sourceItem.data.images.length === 0) {
        this.items.splice(sourceIndex, 1)
      }

      const newItem: ClipboardItem = {
        id: createId(),
        capturedAt: Date.now(),
        hitCount: 1,
        pinned: false,
        data: { kind: 'image', imageId: targetImg.imageId, width: targetImg.width, height: targetImg.height, bytes: targetImg.bytes }
      }
      this.items.splice(req.splitPlacement === 'after' ? sourceIndex + 1 : sourceIndex, 0, newItem)
      this.rebuildIndex()
      this.persist()
      return true
    }

    // Splitting from a file collection
    if (req.paths && req.paths.length > 0 && sourceItem.data.kind === 'files') {
      const sourcePaths = sourceItem.data.paths
      const targetPaths = req.paths
      
      sourceItem.data.paths = sourcePaths.filter(p => !targetPaths.includes(p))
      
      if (sourceItem.data.paths.length === 0) {
        this.items.splice(sourceIndex, 1)
      }

      let newData: ItemData = { kind: 'files', paths: targetPaths }
      if (targetPaths.length === 1) {
        const p = targetPaths[0]
        const imgName = pathBasename(p)
        if (/^[a-z0-9]{6,12}-[a-z0-9]{6,12}\.[a-z0-9]+$/i.test(imgName) || p.includes('edge-drop/images') || p.includes('edge-drop\\images') || p.includes('edge-drop/temp') || p.includes('edge-drop\\temp')) {
          const imageId = imgName.split('.')[0]
          const ext = extname(p).slice(1) || 'png'
          let bytes = 0
          try { bytes = statSync(p).size } catch {}
          newData = { kind: 'image', imageId, width: 0, height: 0, bytes, ext }
        }
      }

      const newItem: ClipboardItem = {
        id: createId(),
        capturedAt: Date.now(),
        hitCount: 1,
        pinned: false,
        data: newData
      }
      this.items.splice(req.splitPlacement === 'after' ? sourceIndex + 1 : sourceIndex, 0, newItem)
      this.rebuildIndex()
      this.persist()
      return true
    }

    return false
  }

  clearUnpinned(): boolean {
    const previousItems = this.items
    const kept: ClipboardItem[] = []
    const removed: ClipboardItem[] = []
    for (const it of this.items) {
      if (it.pinned) kept.push(it)
      else removed.push(it)
    }
    this.items = kept
    this.rebuildIndex()
    if (!this.persistSync()) {
      this.items = previousItems
      this.rebuildIndex()
      return false
    }
    removed.forEach((item) => this.cleanupItemAssets(item))
    return true
  }

  pruneExpired(hours: number): boolean {
    if (!hours || hours <= 0) return false
    const cutoff = Date.now() - hours * 3600 * 1000
    const kept: ClipboardItem[] = []
    let removedAny = false
    for (const it of this.items) {
      if (it.pinned || it.capturedAt >= cutoff) {
        kept.push(it)
      } else {
        removedAny = true
      }
    }
    if (removedAny) {
      const previousItems = this.items
      this.items = kept
      this.rebuildIndex()
      if (!this.persistSync()) {
        this.items = previousItems
        this.rebuildIndex()
        return false
      }
      previousItems.filter((item) => !kept.includes(item)).forEach((item) => this.cleanupItemAssets(item))
    }
    return removedAny
  }

  get(id: string): ClipboardItem | undefined {
    return this.items.find((x) => x.id === id)
  }

  list(): readonly ClipboardItem[] {
    return this.items
  }

  /* ----------------------------- image files ----------------------------- */

  /**
   * Build a display-sized image preview. Sending originals as base64 data URLs
   * duplicates every image in the main process, IPC payload and renderer heap.
   */
  imageToDataUrl(imageId: string, ext?: string): string | null {
    const THUMB_SIZE = 240
    const PREVIEW_CACHE_MAX = 20
    const cacheKey = `${imageId}.${ext || ''}`
    const cached = this.previewCache.get(cacheKey)
    if (cached) {
      this.previewCache.delete(cacheKey)
      this.previewCache.set(cacheKey, cached)
      return cached
    }
    try {
      let img: any = nativeImage.createFromPath(this.imagePath(imageId, ext))
      if (img.isEmpty()) return null
      const size = img.getSize()
      let thumb: any = size.width > THUMB_SIZE || size.height > THUMB_SIZE
        ? img.resize({ width: THUMB_SIZE, quality: 'good' })
        : img
      const url = thumb.toDataURL({ scaleFactor: 1 })
      img = null
      thumb = null
      if (this.previewCache.size >= PREVIEW_CACHE_MAX) {
        this.previewCache.delete(this.previewCache.keys().next().value!)
      }
      this.previewCache.set(cacheKey, url)
      return url
    } catch {
      return null
    }
  }

  /**
   * Stage an image's bytes from a clipboard capture. The image was already
   * written to userData/images by the clipboard watcher (which has the raw
   * nativeImage); here we just no-op because the file already exists.
   * Kept for symmetry / future use.
   */
  private writeImageFile(_imageId: string): void {
    /* no-op: bytes already on disk from capture */
  }

  public getImagePath(imageId: string, ext?: string): string {
    return this.imagePath(imageId, ext)
  }

  private imagePath(imageId: string, ext?: string): string {
    if (ext) {
      const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext
      return join(PATHS.imagesDir(), `${imageId}.${cleanExt}`)
    }
    const dir = PATHS.imagesDir()
    if (existsSync(dir)) {
      try {
        const files = readdirSync(dir)
        for (const f of files) {
          if (f.startsWith(`${imageId}.`)) {
            return join(dir, f)
          }
        }
      } catch { /* ignore */ }
    }
    return join(PATHS.imagesDir(), `${imageId}.png`)
  }

  private removeImageFile(imageId: string): void {
    for (const key of this.previewCache.keys()) {
      if (key.startsWith(imageId)) this.previewCache.delete(key)
    }
    const dir = PATHS.imagesDir()
    if (!existsSync(dir)) return
    try {
      const files = readdirSync(dir)
      for (const f of files) {
        if (f.startsWith(`${imageId}.`)) {
          rmSync(join(dir, f), { force: true })
        }
      }
    } catch {
      /* ignore */
    }
  }

  private textPayloadPath(id: string): string {
    return join(PATHS.payloadsDir(), `${id}.txt`)
  }

  private writeTextPayload(id: string, text: string): boolean {
    const target = this.textPayloadPath(id)
    const temp = `${target}.tmp`
    try {
      const contents = safeStorage.isEncryptionAvailable()
        ? JSON.stringify({ v: 1, encrypted: true, payload: safeStorage.encryptString(text).toString('base64') })
        : text
      writeFileSync(temp, contents, 'utf8')
      renameSync(temp, target)
      return true
    } catch (error) {
      try { rmSync(temp, { force: true }) } catch { /* ignore */ }
      console.error('[ItemStore] Text payload persistence failed:', error)
      return false
    }
  }

  private removeTextPayload(id: string): void {
    try {
      const p = this.textPayloadPath(id)
      if (existsSync(p)) rmSync(p, { force: true })
    } catch { /* ignore */ }
  }

  private readTextPayload(id: string): { text: string; encrypted: boolean } | null {
    try {
      const path = this.textPayloadPath(id)
      if (!existsSync(path)) return null
      const raw = readFileSync(path, 'utf8')
      try {
        const envelope = JSON.parse(raw)
        if (envelope?.encrypted === true && typeof envelope.payload === 'string') {
          if (!safeStorage.isEncryptionAvailable()) return null
          return {
            text: safeStorage.decryptString(Buffer.from(envelope.payload, 'base64')),
            encrypted: true
          }
        }
      } catch {
        /* Legacy plaintext payload. */
      }
      return { text: raw, encrypted: false }
    } catch {
      return null
    }
  }

  public getFullText(id: string): string {
    const item = this.items.find((x) => x.id === id)
    if (!item || item.data.kind !== 'text') return ''
    if (item.data.hasFullPayload) {
      const payload = this.readTextPayload(id)
      if (payload) return payload.text
    }
    return item.data.text
  }

  /* ------------------------------- DTO ----------------------------------- */

  /** Snapshot the whole list as renderer-safe DTOs (images inlined). */
  toDto(): ClipboardItemDto[] {
    return this.items.map((it) => {
      if (it.data.kind === 'image') {
        const { kind, imageId, width, height, bytes, ext } = it.data
        return {
          ...it,
          data: { kind, imageId, width, height, bytes, ext, preview: thumbnailUrlForStoredImage(imageId) }
        }
      }
      if (it.data.kind === 'image-collection') {
        const imagesWithPreviews = it.data.images.map((img) => ({
          ...img,
          preview: thumbnailUrlForStoredImage(img.imageId)
        }))
        return {
          ...it,
          data: { kind: 'image-collection', images: imagesWithPreviews }
        }
      }
      if (it.data.kind === 'files') {
        // Build per-file metadata entries. Generate image preview protocol URLs for image files.
        let imagePreviewCount = 0
        const entries = it.data.paths.map((p) => {
          const entry = buildFileEntry(p)
          if (entry.isImage && imagePreviewCount < 20) {
            imagePreviewCount++
            return {
              ...entry,
              preview: thumbnailUrlForFile(p)
            }
          }
          return entry
        })
        return {
          ...it,
          data: { ...it.data, entries }
        }
      }
      if (it.data.kind === 'text') {
        // Rich HTML is only needed by main-process copy/paste. Keeping it out
        // of snapshots avoids duplicating large Office/browser markup over IPC.
        const { html: _html, ...data } = it.data
        return { ...it, data }
      }
      return { ...it, data: it.data }
    })
  }

  /** Persist a brand-new image captured from the clipboard to its PNG file. */
  stageImageBytes(imageId: string, png: Buffer, ext = 'png'): void {
    try {
      writeFileSync(this.imagePath(imageId, ext), png)
    } catch {
      /* ignore */
    }
  }
}

/** Check if a file path points to an image by extension. */
function isImageExt(p: string): boolean {
  return /\.(png|jpe?g|gif|webp|bmp|svg|avif|ico|tiff?|jfif|pjpeg|pjp)$/i.test(p)
}

/**
 * Build display metadata for a single file path. `size` is best-effort (0 when
 * the file can't be stat'd — e.g. a path on a disconnected drive); the renderer
 * hides the size label when it's 0.
 */
const fileEntryCache = new Map<string, FileEntry>()

function buildFileEntry(p: string): FileEntry {
  if (fileEntryCache.has(p)) return fileEntryCache.get(p)!
  let size = 0
  let isDirectory = false
  try {
    const stats = statSync(p)
    size = stats.size
    isDirectory = stats.isDirectory()
  } catch {
    /* file missing / unreadable — size stays 0 */
  }
  const ext = isDirectory ? '' : (extname(p).slice(1) || '').toLowerCase()
  const name = pathBasename(p)
  const entry: FileEntry = { name, ext, size, isImage: !isDirectory && isImageExt(p), isDirectory }
  if (fileEntryCache.size > 500) fileEntryCache.clear()
  fileEntryCache.set(p, entry)
  return entry
}
