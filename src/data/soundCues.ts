/**
 * Web Audio API synthesized tactile sound cues for instant auditory feedback
 * on Play and Pause actions during AI Gemini narration sessions.
 * 
 * High-quality, subtle, soft sine tones with smooth gain envelopes.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Plays a subtle, non-intrusive tactile sound cue
 * @param type 'play' for ascending chime, 'pause' for descending chime
 */
export function playTactileAudioCue(type: 'play' | 'pause'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'play') {
      // Soft ascending chime: 440Hz (A4) -> 587.33Hz (D5)
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.12);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.start(now);
      osc.stop(now + 0.22);
    } else {
      // Soft descending chime: 523.25Hz (C5) -> 392Hz (G4)
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(392, now + 0.12);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.10, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

      osc.start(now);
      osc.stop(now + 0.20);
    }
  } catch {
    // Ignore transient audio context errors in background
  }
}
