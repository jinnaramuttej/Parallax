import type { ActId } from "./acts";

/**
 * Voice lines. Each one is spoken (an mp3 in public/audio/voice/<id>.mp3,
 * or the browser's speech synthesis if that file is missing) and shown in a
 * speech balloon at his head with the same id. The audio system fires a
 * line once per pass when the scroll enters its trigger, queues lines so
 * they never overlap, and skips a line that was scrolled past quickly.
 */
export type VoiceLine = {
  id: string;
  text: string;
  /** Audio file, served from /public. */
  file: string;
  /** Balloon to show while it plays (src/components/ComicCaption.tsx). */
  balloon: string;
  trigger: {
    act: ActId;
    /** Day progress at which the line fires (inside the act). */
    at: number;
  };
  /** Speech synthesis tuning for the fallback voice. */
  rate?: number;
  pitch?: number;
};

const line = (id: string, text: string, act: ActId, at: number, extra: Partial<VoiceLine> = {}): VoiceLine => ({
  id,
  text,
  file: `/audio/voice/${id}.mp3`,
  balloon: id,
  trigger: { act, at },
  ...extra,
});

export const VOICE: VoiceLine[] = [
  line("wake_1", "Ugh… five more minutes. …Nope. Time to lock in.", "alarm", 0.062, { rate: 0.95 }),
  line("coffee_1", "Coffee first. Code second.", "coffee", 0.176),
  line("boot_1", "Alright. Let's ship something.", "boot", 0.226),
  line("anime_1", "Wait… Darn it, I'm watching anime again. Time to get back.", "break", 0.4635, { rate: 1.1 }),
  line("multi_1", "I can totally do both.", "multitask", 0.566),
  line("error_1", "It worked on my machine.", "bug", 0.706),
  line("can_1", "One more can. Just one.", "fridge", 0.798),
  line("ship_1", "Shipped. Sleep? …Maybe tomorrow.", "deploy", 0.97, { rate: 0.95 }),
];

export const voiceById = (id: string) => VOICE.find((v) => v.id === id);
