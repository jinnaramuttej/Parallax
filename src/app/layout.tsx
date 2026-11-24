import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
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

const description =
  "Scroll through one developer's day, from the 5:59 AM alarm to a 3 AM deploy. A flat-vector parallax story built with Next.js, GSAP and Lenis.";

export const metadata: Metadata = {
  metadataBase: new URL("https://parallax-three-chi.vercel.app"),
  title: "24 Hours of a Dev",
  description,
  applicationName: "24 Hours of a Dev",
  authors: [{ name: "jinnaramuttej", url: "https://github.com/jinnaramuttej" }],
  keywords: ["parallax", "scroll animation", "GSAP", "ScrollTrigger", "Lenis", "Next.js", "SVG"],
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
    <html lang="en" className={`${display.variable} ${mono.variable} antialiased`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
