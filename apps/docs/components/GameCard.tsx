"use client";

import Link from "next/link";
import { gameRegistry, type GameId } from "@game-loader/react";

const cardTokens = {
  surface: "#16161d",
  foreground: "#eae3d2",
  primary: "#8a8678",
  accent: "#ff6a1a",
  muted: "#5b5a52",
  border: "#1f1f26",
};

interface GameCardProps {
  id: GameId;
  size?: "lg" | "md" | "sm";
}

export function GameCard({ id, size = "md" }: GameCardProps) {
  const game = gameRegistry[id];
  if (!game) return null;
  const { displayName, description, tags } = game.meta;
  const sizeMap = { lg: "md" as const, md: "sm" as const, sm: "sm" as const };
  return (
    <Link
      href={`/${id}`}
      className="group relative block bg-ink-2 border border-rule rounded-xl overflow-hidden hover:border-bulb/60 transition-colors"
    >
      <div
        className="relative bg-ink"
        style={{
          aspectRatio: size === "lg" ? "3 / 1.6" : "3 / 1.4",
        }}
      >
        <div className="absolute inset-0 grid place-items-center">
          <game.Component
            tokens={cardTokens}
            size={sizeMap[size]}
            reducedMotion={true}
            paused={true}
          />
        </div>
        <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.18em] uppercase text-bulb bg-ink/80 backdrop-blur-sm border border-bulb/30 rounded-full px-2.5 py-1">
          {tags[0]}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl font-medium tracking-tight">
            {displayName}
          </h3>
          <span className="font-mono text-[10px] text-muted group-hover:text-bulb transition-colors">
            play →
          </span>
        </div>
        <p className="text-muted text-sm mt-1.5 line-clamp-2 leading-relaxed">
          {description}
        </p>
        {tags.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {tags.slice(1).map((t: string) => (
              <span
                key={t}
                className="text-[10px] font-mono uppercase tracking-wider text-muted"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
