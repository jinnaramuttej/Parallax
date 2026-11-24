import { useSyncExternalStore } from "react";

type Listener = (value: number) => void;

function createStore(initial: number) {
  let value = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set(next: number) {
      if (next === value) return;
      value = next;
      listeners.forEach((fn) => fn(value));
    },
    subscribe(fn: Listener) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

/** 0–1 progress through the day, written by the master timeline. */
export const dayStore = createStore(0);

/** Extra cans from clicking the fridge (added on top of the story's cans). */
export const bonusCansStore = createStore(0);

/**
 * React hook for components that genuinely need to re-render on progress.
 * Per-frame visuals should subscribe directly and write to the DOM instead.
 */
export function useStoreValue(store: ReturnType<typeof createStore>) {
  return useSyncExternalStore(
    (cb) => store.subscribe(cb),
    store.get,
    store.get,
  );
}
