// Tiny Web Audio helper — no assets, no libs. The line "sings" as it grows:
// each energy tile added plays the next step up a major pentatonic scale.
let ctx = null;

export function initAudio() {
  const ensure = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
  };
  // audio unlocks on the first user gesture (mobile autoplay policy)
  window.addEventListener("pointerdown", ensure);
  window.addEventListener("touchstart", ensure);
}

const PENTA = [0, 2, 4, 7, 9]; // major pentatonic, in semitones
const BASE = 261.63;           // C4

// n-th energy tile in the line (1-based) → n-th scale step.
// `delay` staggers notes when several tiles join in one drag movement.
export function lineNote(n, delay = 0) {
  if (!ctx || ctx.state !== "running") return;
  const step = n - 1;
  const semis = 12 * Math.floor(step / PENTA.length) + PENTA[step % PENTA.length];
  blip(BASE * Math.pow(2, semis / 12), ctx.currentTime + delay);
}

function blip(freq, t) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "triangle";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.15, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.25);
}
