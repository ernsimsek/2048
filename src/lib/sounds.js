// Audio system using Web Audio API for lightweight game sounds

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playMove() {
  playTone(440, 0.08, 'sine', 0.08);
}

export function playMerge() {
  playTone(523, 0.1, 'triangle', 0.12);
  setTimeout(() => playTone(659, 0.12, 'triangle', 0.1), 50);
}

export function playBigMerge() {
  playTone(523, 0.15, 'square', 0.1);
  setTimeout(() => playTone(659, 0.12, 'square', 0.08), 60);
  setTimeout(() => playTone(784, 0.15, 'square', 0.06), 120);
}

export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.3, 'triangle', 0.12), i * 150);
  });
}

export function playLose() {
  playTone(330, 0.3, 'sawtooth', 0.08);
  setTimeout(() => playTone(294, 0.4, 'sawtooth', 0.06), 200);
}

export function playAchievement() {
  const notes = [784, 988, 1175, 1319];
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.2, 'sine', 0.1), i * 100);
  });
}

export function vibrate(ms = 20) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch {}
}