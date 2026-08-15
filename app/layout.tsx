import "./globals.css";
import { Figtree, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

/* Self-hosted and preloaded by Next. The previous <link> to Google Fonts was
   render-blocking and cost a DNS + TLS handshake plus two round trips (CSS,
   then the font files) before any text could paint. `display: swap` plus a
   CSS variable also removes the layout shift when the webfont lands. */
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import LensSfx from "@/components/LensSfx";
import IntroSequence from "@/components/intro/IntroSequence";

export const metadata = {
  title: "Bintang Syafrian Rizal | Software Developer",
  description: "Portfolio showcasing my web development projects and skills",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${figtree.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Decides the intro *before* first paint and flags it on <html>, so
            CSS can cover the page immediately. Waiting for React meant the
            portfolio was visible for a beat before the overlay mounted. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var c=document.createElement('canvas');
  var gl=!!(c.getContext('webgl2')||c.getContext('webgl'));
  var seen=sessionStorage.getItem('intro-seen')==='1';
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(gl&&!seen&&!rm)document.documentElement.setAttribute('data-intro','1');
}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background flex min-h-dvh flex-col overflow-x-hidden antialiased font-sans",
        )}
      >
        <CursorGlow />
        <LensSfx />
        {/* Overlays the site rather than gating it, so the page underneath is
            still server-rendered and crawlable while the intro plays. */}
        <IntroSequence />
        <Header />
        {/* Header spacer */}
        <div className="h-14" />
        <main className="flex-1 blueprint-grid">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
