import type { Metadata, Viewport } from "next";
import { Bangers, Bricolage_Grotesque, JetBrains_Mono, Patrick_Hand } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SCALE_SCRIPT } from "@/scene/viewport";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

/** Comic lettering: impact words (Bangers) and hand-lettered balloons and boards (Patrick Hand). */
const impact = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
});

const hand = Patrick_Hand({
  variable: "--font-hand",
  weight: "400",
  subsets: ["latin"],
});

const description =
  "One developer (and his cat), one day, ten acts: from the 5:59 AM alarm to a 3 AM deploy. Scroll it or press play. A flat-vector parallax comic with sound, built with Next.js, GSAP and Lenis.";

export const metadata: Metadata = {
  metadataBase: new URL("https://parallax-three-chi.vercel.app"),
  title: "24 Hours of a Dev",
  description,
  applicationName: "24 Hours of a Dev",
  authors: [{ name: "jinnaramuttej", url: "https://github.com/jinnaramuttej" }],
  keywords: ["parallax", "scroll animation", "scrollytelling", "GSAP", "ScrollTrigger", "Lenis", "Next.js", "SVG", "Web Audio"],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "24 Hours of a Dev",
    title: "24 Hours of a Dev",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "24 Hours of a Dev",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1f1b3d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script sets --s on <html> before React hydrates.
    <html lang="en" className={`${display.variable} ${mono.variable} ${impact.variable} ${hand.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCALE_SCRIPT }} />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
