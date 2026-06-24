"use client";

import { DinoGame } from "@game-loader/react";
import { usePrefersReducedMotion } from "@game-loader/react";
import Link from "next/link";

const heroTokens = {
  surface: "transparent",
  foreground: "#eae3d2",
  primary: "#8a8678",
  accent: "#ff6a1a",
  muted: "#5b5a52",
  border: "#1f1f26",
};

export function Hero() {
  const reduced = usePrefersReducedMotion();
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div className="absolute inset-0 motion-safe-only">
        <DinoGame
          tokens={heroTokens}
          size="full"
          reducedMotion={reduced}
          paused={false}
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none motion-safe-only"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,14,18,0.92) 0%, rgba(14,14,18,0.55) 35%, rgba(14,14,18,0.2) 65%, rgba(14,14,18,0.85) 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-10 bg-bulb" />
          <span className="font-mono text-[11px] tracking-[0.22em] text-bulb uppercase">
            v0.1 · three games · zero assets
          </span>
        </div>

        <h1 className="font-display text-[44px] sm:text-[64px] md:text-[88px] leading-[0.95] font-light max-w-3xl">
          <span className="block">Loaders that</span>
          <span className="block">
            <em className="italic font-normal text-bulb">play</em>
            <span className="text-muted">, not</span>
          </span>
          <span className="block">just spin.</span>
        </h1>

        <p className="mt-8 max-w-xl text-muted text-lg leading-relaxed">
          A small React library that turns your loading state into a
          mini-game. The data lands, the game hands off to your real UI,
          nobody stares at a spinner.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/sandbox"
            className="group inline-flex items-center gap-2 bg-bulb text-ink font-medium px-5 py-2.5 rounded-full hover:bg-bulb-2 transition-colors"
          >
            Try the sandbox
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href="/dino"
            className="inline-flex items-center gap-2 border border-rule px-5 py-2.5 rounded-full text-foreground hover:bg-ink-2 transition-colors"
          >
            Browse games
          </Link>
        </div>

        <div className="mt-16 max-w-2xl">
          <pre className="font-mono text-[13px] leading-relaxed bg-ink-2/80 backdrop-blur-sm border border-rule rounded-lg px-5 py-4 overflow-x-auto">
            <code>
              <span className="text-muted">{"import { "}</span>
              <span className="text-foreground">GameLoader</span>
              <span className="text-muted">{" } from "}</span>
              <span className="text-bulb">{"\"@game-loader/react\""}</span>
              <span className="text-muted">{";"}</span>
              {"\n\n"}
              <span className="text-muted">{"<"}</span>
              <span className="text-foreground">GameLoader</span>
              <span className="text-muted">{" loading={"}</span>
              <span className="text-foreground">isFetching</span>
              <span className="text-muted">{"} game="}</span>
              <span className="text-bulb">{"\"dino\""}</span>
              <span className="text-muted">{">"}</span>
              {"\n  "}
              <span className="text-foreground">{"<Dashboard />"}</span>
              {"\n"}
              <span className="text-muted">{"</"}</span>
              <span className="text-foreground">GameLoader</span>
              <span className="text-muted">{">"}</span>
            </code>
          </pre>
        </div>
      </div>

      <div className="relative border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-muted">
          <span>↑ press space · the dino is real</span>
          <span className="hidden sm:inline">3 games · 0 deps · ~12kb gz</span>
        </div>
      </div>
    </section>
  );
}
