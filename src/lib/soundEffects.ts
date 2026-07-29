/**
 * Web Audio API Haptic Sound Synthesizer for Edge-Drop.
 * Provides zero-latency, crisp mechanical rotary dial tick sounds.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

/**
 * Plays a satisfying mechanical rotary dial tick sound.
 * Designed to emulate a high-end camera dial / Apple Watch digital crown detent click.
 */
export function playDialTickSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // 1. High-frequency metallic ratchet sweep (2600Hz -> 700Hz in 10ms)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(2600, now)
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.01)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.01)

    // 2. Subtle low-end mechanical detent thud (180Hz -> 60Hz in 12ms)
    const bodyOsc = ctx.createOscillator()
    const bodyGain = ctx.createGain()

    bodyOsc.type = 'triangle'
    bodyOsc.frequency.setValueAtTime(180, now)
    bodyOsc.frequency.exponentialRampToValueAtTime(60, now + 0.012)

    bodyGain.gain.setValueAtTime(0.12, now)
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012)

    bodyOsc.connect(bodyGain)
    bodyGain.connect(ctx.destination)

    bodyOsc.start(now)
    bodyOsc.stop(now + 0.012)
  } catch {
    /* ignore Web Audio API restrictions/errors */
  }
}
