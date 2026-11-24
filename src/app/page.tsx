import { ParallaxLayer } from "@/components/ParallaxLayer";

// Temporary setup check for Lenis + ScrollTrigger + ParallaxLayer.
// Replace with the "24 hours of a dev" scene.
const SPEEDS = [0.3, 1, 1.6];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="grid h-screen place-items-center">
        <p className="font-mono text-sm opacity-60">setup check: scroll ↓</p>
      </section>

      <section className="relative h-[150vh] overflow-hidden">
        {SPEEDS.map((speed, i) => (
          <ParallaxLayer
            key={speed}
            speed={speed}
            data-speed={speed}
            className="absolute top-1/2 -translate-x-1/2"
            style={{ left: `${25 + i * 25}%` }}
          >
            <div className="grid size-28 place-items-center rounded-2xl bg-foreground font-mono text-sm text-background">
              speed {speed}
            </div>
          </ParallaxLayer>
        ))}
      </section>

      <section className="h-screen" />
    </main>
  );
}
