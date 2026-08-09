/**
 * Tracks editor revisions so an older async save can never mark newer input as
 * persisted. The editor keeps the draft itself; this class only owns ordering.
 */
export class NoteSaveRevision {
  private currentRevision = 0
  private savedRevision = 0

  reset(): void {
    this.currentRevision = 0
    this.savedRevision = 0
  }

  markEdited(): number {
    this.currentRevision += 1
    return this.currentRevision
  }

  capture(): number {
    return this.currentRevision
  }

  isCurrent(revision: number): boolean {
    return revision === this.currentRevision
  }

  markSaved(revision: number): boolean {
    if (!this.isCurrent(revision)) return false
    this.savedRevision = revision
    return true
  }

  needsSave(): boolean {
    return this.savedRevision !== this.currentRevision
  }
}
