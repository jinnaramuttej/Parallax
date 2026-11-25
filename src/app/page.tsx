import { readdirSync } from "node:fs";
import path from "node:path";
import { Footer } from "@/components/Footer";
import { Stats } from "@/components/Stats";
import { Scene } from "@/scene/Scene";

/**
 * Recorded voice lines that exist in public/audio/voice (read at build
 * time). Lines without a file fall back to speech synthesis, so the page
 * never requests a file that is not there.
 */
function voiceFiles() {
  try {
    return readdirSync(path.join(process.cwd(), "public", "audio", "voice"))
      .filter((f) => f.endsWith(".mp3"))
      .map((f) => `/audio/voice/${f}`);
  } catch {
    return [];
  }
}

export default function Home() {
  return (
    <main>
      <Scene voiceFiles={voiceFiles()} />
      <Stats />
      <Footer />
    </main>
  );
}
