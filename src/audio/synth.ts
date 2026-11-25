/**
 * Synthesised sound effects (Web Audio, no files). Each one schedules a few
 * nodes on the given context, plays once into `out` and cleans itself up.
 */

export type SfxName =
  | "alarm"
  | "ping"
  | "keys"
  | "crack"
  | "pop"
  | "click"
  | "meow"
  | "whoosh"
  | "error"
  | "boot";

let noiseBuffer: AudioBuffer | null = null;

/** Two seconds of white noise, made once per context. */
function noise(ctx: AudioContext) {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

/** A gain envelope: attack to `peak`, exponential decay to silence. */
function env(ctx: AudioContext, out: AudioNode, at: number, peak: number, attack: number, decay: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  g.connect(out);
  return g;
}

function tone(ctx: AudioContext, out: AudioNode, type: OscillatorType, freq: number, at: number, peak: number, attack: number, decay: number, toFreq?: number) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, at + attack + decay);
  o.connect(env(ctx, out, at, peak, attack, decay));
  o.start(at);
  o.stop(at + attack + decay + 0.05);
}

function burst(ctx: AudioContext, out: AudioNode, at: number, peak: number, decay: number, filter: BiquadFilterType, freq: number, q = 1, toFreq?: number) {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.frequency.setValueAtTime(freq, at);
  if (toFreq) f.frequency.exponentialRampToValueAtTime(toFreq, at + decay);
  f.Q.value = q;
  src.connect(f);
  f.connect(env(ctx, out, at, peak, 0.004, decay));
  src.start(at, Math.random() * 1.5);
  src.stop(at + decay + 0.05);
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export const SFX: Record<SfxName, (ctx: AudioContext, out: AudioNode) => void> = {
  /** Twin-bell alarm: two bursts of fast beeps. */
  alarm(ctx, out) {
    const t = ctx.currentTime;
    for (let r = 0; r < 2; r++)
      for (let i = 0; i < 4; i++) tone(ctx, out, "square", 1046, t + r * 0.62 + i * 0.11, 0.16, 0.005, 0.07);
  },
  /** Notification: a soft two-note chime. */
  ping(ctx, out) {
    const t = ctx.currentTime;
    tone(ctx, out, "sine", 1318.5, t, 0.3, 0.01, 0.35);
    tone(ctx, out, "sine", 1760, t + 0.12, 0.26, 0.01, 0.5);
  },
  /** A short burst of mechanical key clicks, random pitch. */
  keys(ctx, out) {
    let t = ctx.currentTime;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      burst(ctx, out, t, rnd(0.12, 0.22), rnd(0.02, 0.035), "bandpass", rnd(1800, 3400), 3);
      tone(ctx, out, "triangle", rnd(180, 260), t, 0.05, 0.002, 0.03);
      t += rnd(0.045, 0.095);
    }
  },
  /** Can opening: a sharp crack, then the hiss. */
  crack(ctx, out) {
    const t = ctx.currentTime;
    burst(ctx, out, t, 0.5, 0.04, "highpass", 2500, 0.7);
    tone(ctx, out, "square", 900, t, 0.08, 0.002, 0.03, 300);
    burst(ctx, out, t + 0.03, 0.22, 0.6, "bandpass", 6000, 0.8, 2500);
  },
  /** Confetti cannon: a pop and a few sparkles. */
  pop(ctx, out) {
    const t = ctx.currentTime;
    burst(ctx, out, t, 0.45, 0.08, "lowpass", 1800, 0.8);
    tone(ctx, out, "sine", 420, t, 0.35, 0.004, 0.18, 70);
    for (let i = 0; i < 6; i++) tone(ctx, out, "sine", rnd(2200, 4200), t + 0.08 + i * rnd(0.03, 0.07), 0.06, 0.004, 0.18);
  },
  /** UI click. */
  click(ctx, out) {
    tone(ctx, out, "sine", 1250, ctx.currentTime, 0.14, 0.002, 0.04, 900);
  },
  /** A cat's meow: a nasal sweep up and down with vibrato. */
  meow(ctx, out) {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(520, t);
    o.frequency.linearRampToValueAtTime(860, t + 0.16);
    o.frequency.linearRampToValueAtTime(600, t + 0.48);
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vib.frequency.value = 7;
    vibGain.gain.value = 18;
    vib.connect(vibGain).connect(o.frequency);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 4;
    f.frequency.setValueAtTime(900, t);
    f.frequency.linearRampToValueAtTime(1600, t + 0.18);
    f.frequency.linearRampToValueAtTime(1000, t + 0.5);
    o.connect(f).connect(env(ctx, out, t, 0.32, 0.05, 0.5));
    o.start(t);
    vib.start(t);
    o.stop(t + 0.62);
    vib.stop(t + 0.62);
  },
  /** Whip pan: a filtered noise sweep. */
  whoosh(ctx, out) {
    burst(ctx, out, ctx.currentTime, 0.32, 0.38, "bandpass", 300, 1.2, 3200);
  },
  /** Build error: two low buzzes. */
  error(ctx, out) {
    const t = ctx.currentTime;
    tone(ctx, out, "square", 110, t, 0.18, 0.005, 0.16);
    tone(ctx, out, "square", 98, t + 0.2, 0.18, 0.005, 0.24);
  },
  /** Machines waking: a rising three-note chime. */
  boot(ctx, out) {
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => tone(ctx, out, "triangle", f, t + i * 0.09, 0.14, 0.01, 0.45));
  },
};

/** A low fridge hum that runs until stopped. */
export function hum(ctx: AudioContext, out: AudioNode) {
  const t = ctx.currentTime;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.09, t + 0.4);
  const f = ctx.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 220;
  f.connect(g).connect(out);
  const oscs = [55, 110, 165].map((freq, i) => {
    const o = ctx.createOscillator();
    o.type = i === 0 ? "sawtooth" : "sine";
    o.frequency.value = freq;
    o.connect(f);
    o.start(t);
    return o;
  });
  return () => {
    const now = ctx.currentTime;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    oscs.forEach((o) => o.stop(now + 0.35));
  };
}

/**
 * Lo-fi ambient loop: soft seventh chords, a lazy kick and hats, vinyl
 * crackle. Scheduled ahead in small steps; returns a stop function.
 */
export function lofi(ctx: AudioContext, out: AudioNode) {
  const bpm = 74;
  const beat = 60 / bpm;
  const chords = [
    [261.63, 329.63, 392.0, 493.88],
    [220.0, 261.63, 329.63, 392.0],
    [174.61, 220.0, 261.63, 329.63],
    [196.0, 246.94, 293.66, 349.23],
  ];
  const bus = ctx.createGain();
  bus.gain.setValueAtTime(0.0001, ctx.currentTime);
  bus.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.5);
  const warm = ctx.createBiquadFilter();
  warm.type = "lowpass";
  warm.frequency.value = 1400;
  warm.connect(bus).connect(out);

  // Vinyl crackle.
  const crackle = ctx.createBufferSource();
  crackle.buffer = noise(ctx);
  crackle.loop = true;
  const cf = ctx.createBiquadFilter();
  cf.type = "highpass";
  cf.frequency.value = 3000;
  const cg = ctx.createGain();
  cg.gain.value = 0.012;
  crackle.connect(cf).connect(cg).connect(bus);
  crackle.start();

  let next = ctx.currentTime + 0.1;
  let step = 0;
  const schedule = () => {
    while (next < ctx.currentTime + 0.4) {
      const bar = Math.floor(step / 4) % chords.length;
      const inBar = step % 4;
      if (inBar === 0) chords[bar].forEach((f) => tone(ctx, warm, "triangle", f, next, 0.05, 0.25, beat * 4));
      if (inBar === 0 || inBar === 2) tone(ctx, warm, "sine", 90, next, 0.35, 0.005, 0.28, 45);
      burst(ctx, warm, next + beat / 2, 0.035, 0.05, "highpass", 7000, 0.7);
      next += beat;
      step++;
    }
  };
  schedule();
  const timer = window.setInterval(schedule, 120);
  return () => {
    window.clearInterval(timer);
    const now = ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    crackle.stop(now + 0.7);
  };
}
