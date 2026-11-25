import type { VoiceLine } from "@/config/voice";
import { hum, lofi, SFX, type SfxName } from "./synth";

export type Channel = "voice" | "sfx" | "ambient";

const STORAGE_KEY = "parallax:sound";

/** How long a line takes to say, for the balloon when there is no audio. */
export function estimateDuration(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.round(800 + words * 360 + (text.match(/…|\.\.\./g)?.length ?? 0) * 350);
}

type Playback = { done: Promise<{ completed: boolean; via: "file" | "speech" | "silent" }>; stop: () => void };

/**
 * The one audio manager. Sound is off until the visitor turns it on, and
 * nothing plays before a user gesture unlocks audio. Files (voice lines)
 * play through Howler; effects and the ambient loop are synthesised with
 * Web Audio; a voice line without its mp3 falls back to speech synthesis.
 * Nothing here throws: every failure falls back to silence.
 */
class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: Partial<Record<Channel, GainNode>> = {};
  private howler: typeof import("howler") | null = null;
  private stopAmbient: (() => void) | null = null;
  private stopHum: (() => void) | null = null;
  private listeners = new Set<() => void>();
  /** Voice files that exist (read from public/ at build time). */
  private files = new Set<string>();

  unlocked = false;
  /** The visitor's choice (persisted). Sound is off by default. */
  wantsSound = false;
  volume = 0.85;
  levels: Record<Channel, number> = { voice: 1, sfx: 0.5, ambient: 0.3 };

  constructor() {
    try {
      this.wantsSound = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      this.wantsSound = false;
    }
  }

  /** Audible right now: unlocked by a gesture and switched on. */
  get audible() {
    return this.unlocked && this.wantsSound;
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  setVoiceFiles(files: string[]) {
    this.files = new Set(files);
  }

  /** Call from a user gesture (click, key, tap). Safe to call repeatedly. */
  unlock() {
    try {
      if (!this.ctx) {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.wantsSound ? this.volume : 0;
        this.master.connect(this.ctx.destination);
        for (const ch of ["voice", "sfx", "ambient"] as Channel[]) {
          const g = this.ctx.createGain();
          g.gain.value = this.levels[ch];
          g.connect(this.master);
          this.bus[ch] = g;
        }
      }
      void this.ctx.resume().catch(() => {});
      this.unlocked = true;
      void import("howler")
        .then((h) => {
          this.howler = h;
          h.Howler.volume(this.volume);
          h.Howler.mute(!this.wantsSound);
        })
        .catch(() => {});
      if (this.wantsSound) this.startAmbient();
      this.emit();
    } catch {
      // No audio on this device: everything stays silent.
    }
  }

  /** Turn sound on or off (remembered for the next visit). */
  setMuted(muted: boolean) {
    this.wantsSound = !muted;
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "off" : "on");
    } catch {
      // Private mode or blocked storage: the choice just isn't remembered.
    }
    if (this.ctx && this.master) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(muted ? 0 : this.volume, now, 0.05);
    }
    this.howler?.Howler.mute(muted);
    if (muted) {
      this.stopAmbientLoop();
      this.stopFridgeHum();
      try {
        window.speechSynthesis?.cancel();
      } catch {}
    } else if (this.unlocked) {
      this.startAmbient();
    }
    this.emit();
  }

  setVolume(v: number) {
    this.volume = Math.min(1, Math.max(0, v));
    if (this.master && this.ctx && this.wantsSound) this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    this.howler?.Howler.volume(this.volume);
  }

  sfx(name: SfxName) {
    if (!this.audible || !this.ctx || !this.bus.sfx) return;
    try {
      SFX[name](this.ctx, this.bus.sfx);
    } catch {}
  }

  startFridgeHum() {
    if (!this.audible || !this.ctx || !this.bus.sfx || this.stopHum) return;
    try {
      this.stopHum = hum(this.ctx, this.bus.sfx);
    } catch {}
  }
  stopFridgeHum() {
    this.stopHum?.();
    this.stopHum = null;
  }

  private startAmbient() {
    if (this.stopAmbient || !this.ctx || !this.bus.ambient || !this.wantsSound) return;
    try {
      this.stopAmbient = lofi(this.ctx, this.bus.ambient);
    } catch {}
  }
  private stopAmbientLoop() {
    this.stopAmbient?.();
    this.stopAmbient = null;
  }

  /**
   * Say a voice line: its mp3 if there is one, else speech synthesis, else
   * (sound off or locked) silence for as long as it would take to say.
   * Always resolves; never throws.
   */
  playVoice(line: VoiceLine): Playback {
    const estimate = estimateDuration(line.text);
    let stop = () => {};
    const done = new Promise<{ completed: boolean; via: "file" | "speech" | "silent" }>((resolve) => {
      let settled = false;
      const finish = (completed: boolean, via: "file" | "speech" | "silent") => {
        if (settled) return;
        settled = true;
        window.clearTimeout(guard);
        resolve({ completed, via });
      };
      // Never let a line hang the queue.
      const guard = window.setTimeout(() => finish(true, "silent"), estimate * 2.5 + 1500);

      const silent = () => {
        const t = window.setTimeout(() => finish(true, "silent"), estimate);
        stop = () => {
          window.clearTimeout(t);
          finish(false, "silent");
        };
      };

      const speak = () => {
        const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
        if (!synth || typeof SpeechSynthesisUtterance === "undefined") return silent();
        try {
          const u = new SpeechSynthesisUtterance(line.text.replace(/…/g, "... "));
          u.rate = line.rate ?? 1;
          u.pitch = line.pitch ?? 1;
          u.volume = this.volume * this.levels.voice;
          u.onend = () => finish(true, "speech");
          u.onerror = () => finish(false, "speech");
          synth.cancel();
          synth.speak(u);
          stop = () => {
            try {
              synth.cancel();
            } catch {}
            finish(false, "speech");
          };
        } catch {
          silent();
        }
      };

      if (!this.audible) return silent();
      const H = this.howler;
      if (!H || !this.files.has(line.file)) return speak();
      try {
        const howl = new H.Howl({
          src: [line.file],
          volume: this.levels.voice,
          onend: () => {
            finish(true, "file");
            howl.unload();
          },
          onloaderror: () => {
            howl.unload();
            speak();
          },
          onplayerror: () => {
            howl.unload();
            speak();
          },
        });
        howl.play();
        stop = () => {
          howl.stop();
          howl.unload();
          finish(false, "file");
        };
      } catch {
        speak();
      }
    });
    return { done, stop: () => stop() };
  }
}

let instance: AudioManager | null = null;

/** The audio manager (client only). */
export function audio() {
  instance ??= new AudioManager();
  return instance;
}
