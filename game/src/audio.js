// Lantern Lane: every sound, synthesised with the Web Audio API.
// One job: small bleeps and chimes. No audio files, no network; the
// context is created lazily on the first user gesture (browsers require
// that) and everything is muted when the player asks.
let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
}

function ensureContext() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

/** One sine note: frequency, when it starts, how long, how loud. */
function note(freq, delay, duration, volume) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** A bright two-note chime when a difference is found. */
export function playFound() {
  note(880, 0, 0.18, 0.16);
  note(1318.5, 0.08, 0.28, 0.14);
}

/** A low buzz for a wrong click. */
export function playWrong() {
  note(160, 0, 0.16, 0.12);
  note(120, 0.1, 0.2, 0.1);
}

/** A soft tick for a hint. */
export function playHint() {
  note(660, 0, 0.12, 0.1);
  note(990, 0.06, 0.16, 0.08);
}

/** A little rising fanfare for finishing a scene. */
export function playWin() {
  note(523.25, 0, 0.2, 0.14);
  note(659.25, 0.12, 0.2, 0.14);
  note(783.99, 0.24, 0.2, 0.14);
  note(1046.5, 0.36, 0.4, 0.16);
}
