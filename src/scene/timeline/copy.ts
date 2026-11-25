import { gsap, SplitText } from "@/lib/gsap";
import { U } from "./fx";
import type { BuildContext } from "./master";

type Split = { chars: Element[]; words: Element[]; block: Element };

/**
 * Split every act's headline into characters (masked per word) and its
 * subtext into words, once per timeline build. Reverted on cleanup.
 */
export function splitCopy({ q, reduce, cleanup }: BuildContext) {
  const splits = new Map<string, Split>();
  q("[data-copy]").forEach((block) => {
    const i = (block as HTMLElement).dataset.copy ?? "";
    if (reduce) {
      splits.set(i, { chars: [], words: [], block });
      return;
    }
    const title = SplitText.create(block.querySelector(".copy-title"), {
      type: "words,chars",
      mask: "words",
    });
    const sub = SplitText.create(block.querySelector(".copy-sub"), {
      type: "words",
      mask: "words",
    });
    cleanup.push(() => {
      title.revert();
      sub.revert();
    });
    splits.set(i, { chars: title.chars, words: sub.words, block });
  });
  return splits;
}

/** Scrubbed reveal: characters rise out of their word masks, then the subtext. */
export function revealCopy(tl: gsap.core.Timeline, split: Split | undefined, at: number) {
  if (!split) return;
  tl.set(split.block, { autoAlpha: 1 }, at);
  // The note gets stuck to the wall...
  tl.fromTo(
    split.block,
    { scale: 1.06, y: 16 },
    { scale: 1, y: 0, duration: 0.18 * U, ease: "back.out(2.2)", immediateRender: false },
    at,
  );
  if (!split.chars.length) {
    tl.fromTo(split.block, { opacity: 0 }, { opacity: 1, duration: 0.2 * U, immediateRender: false }, at);
    return;
  }
  tl.fromTo(
    split.chars,
    { yPercent: 115 },
    { yPercent: 0, duration: 0.24 * U, stagger: 0.008 * U, ease: "power3.out" },
    at,
  );
  tl.fromTo(
    split.words,
    { yPercent: 110, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.2 * U, stagger: 0.012 * U, ease: "power2.out" },
    at + 0.14 * U,
  );
}

/** Scrubbed exit: everything slides up and out of its mask. */
export function exitCopy(tl: gsap.core.Timeline, split: Split | undefined, at: number) {
  if (!split) return;
  if (split.chars.length) {
    tl.to(
      [...split.chars, ...split.words],
      { yPercent: -115, duration: 0.2 * U, stagger: 0.003 * U, ease: "power2.in" },
      at,
    );
  }
  // ...and peeled off again.
  tl.to(split.block, { opacity: 0, y: -8, duration: 0.18 * U, ease: "power1.in" }, at + 0.08 * U);
  tl.set(split.block, { visibility: "hidden" }, at + 0.26 * U);
}

/** Initial state for copy that is visible at progress 0 (stop 0). */
export function showCopyNow(split: Split | undefined) {
  if (split) gsap.set(split.block, { autoAlpha: 1 });
}
