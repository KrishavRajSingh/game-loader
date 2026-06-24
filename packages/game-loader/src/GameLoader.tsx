"use client";

import { useEffect, useMemo, useState } from "react";
import { getGame } from "./games/registry.js";
import { useThemeTokens } from "./theme/useThemeTokens.js";
import { usePrefersReducedMotion } from "./utils/usePrefersReducedMotion.js";
import { SIZE_PX } from "./types.js";
import type { GameLoaderProps, Size } from "./types.js";

function sizeStyle(size: Size) {
  if (size === "full") {
    return { width: "100%", height: "auto", aspectRatio: "3 / 1" };
  }
  const { width, height } = SIZE_PX[size];
  return { width: "100%", maxWidth: width, height, aspectRatio: `${width} / ${height}` };
}

export function GameLoader({
  loading,
  game,
  theme = "auto",
  size = "md",
  reducedMotion = "honor",
  className,
  fallback,
  onReady,
  children,
}: GameLoaderProps) {
  const prefersReduced = usePrefersReducedMotion();
  const shouldReduce = reducedMotion === "honor" && prefersReduced;
  const tokens = useThemeTokens(theme);
  const definition = useMemo(() => getGame(game), [game]);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (loading && !booted) {
      setBooted(true);
      onReady?.();
    }
    if (!loading) setBooted(false);
  }, [loading, booted, onReady]);

  if (!loading) return <>{children}</>;
  if (!definition) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={className}
        style={{ ...sizeStyle(size), display: "grid", placeItems: "center" }}
      >
        {fallback ?? <span style={{ color: tokens.muted }}>Loading…</span>}
      </div>
    );
  }

  const Game = definition.Component;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading with ${definition.meta.displayName}`}
      className={className}
      style={{
        ...sizeStyle(size),
        background: tokens.surface,
        color: tokens.foreground,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        border: `1px solid ${tokens.border}`,
      }}
    >
      {fallback ?? (
        <Game
          tokens={tokens}
          size={size}
          reducedMotion={shouldReduce}
          paused={!loading}
        />
      )}
    </div>
  );
}

GameLoader.displayName = "GameLoader";

type GameLoaderOnlyProps = Omit<GameLoaderProps, "loading" | "children"> & {
  game: GameLoaderProps["game"];
};

GameLoader.Loading = function GameLoaderLoading(props: GameLoaderOnlyProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{ width: "100%", height: "100%" }}
    >
      <GameLoader
        {...props}
        loading={true}
        children={null}
      />
    </div>
  );
};
