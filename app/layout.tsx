import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&family=JetBrains+Mono:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "bg-background flex min-h-dvh flex-col overflow-x-hidden antialiased",
        )}
        style={{ fontFamily: "'Figtree', sans-serif" }}
      >
        <CursorGlow />
        <Header />
        {/* Header spacer */}
        <div className="h-[64px] sm:h-[76px]" />
        <main className="flex-1 blueprint-grid">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
