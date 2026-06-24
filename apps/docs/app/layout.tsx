import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jet = JetBrains_Mono({
  variable: "--font-jet",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "game-loader — loaders that play",
  description:
    "Drop-in mini-games that play while your data fetches. React 19, TypeScript, SSR-safe, themeable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jet.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-foreground">
        <header className="border-b border-rule">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="font-mono text-[11px] tracking-[0.18em] text-bulb uppercase">
                gl
              </span>
              <span className="font-display text-lg font-medium tracking-tight">
                game-loader
              </span>
            </Link>
            <nav className="flex items-center gap-7 text-[13px] text-muted">
              <Link href="/dino" className="hover:text-foreground transition-colors">
                dino
              </Link>
              <Link href="/snake" className="hover:text-foreground transition-colors">
                snake
              </Link>
              <Link href="/pong" className="hover:text-foreground transition-colors">
                pong
              </Link>
              <Link
                href="/sandbox"
                className="text-foreground underline decoration-bulb decoration-2 underline-offset-4"
              >
                sandbox
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted">
            <span>@game-loader/react · MIT</span>
            <span>v0.1.0</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
