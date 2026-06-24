import type { ComponentType, ReactNode } from "react";

export type GameId = "dino" | "snake" | "pong" | (string & {});

export type Size = "sm" | "md" | "lg" | "full";

export type ThemeMode = "light" | "dark" | "auto";

export type ReducedMotionPolicy = "honor" | "play";

export interface ThemeTokens {
  surface: string;
  foreground: string;
  primary: string;
  accent: string;
  muted: string;
  border: string;
}

export interface GameMeta {
  id: GameId;
  displayName: string;
  description: string;
  tags: string[];
  minSize: Size;
}

export interface GameProps {
  tokens: ThemeTokens;
  size: Size;
  reducedMotion: boolean;
  paused?: boolean;
  className?: string;
}

export interface GameDefinition {
  meta: GameMeta;
  Component: ComponentType<GameProps>;
}

export interface GameLoaderProps {
  loading: boolean;
  game: GameId;
  theme?: ThemeMode | Partial<ThemeTokens>;
  size?: Size;
  reducedMotion?: ReducedMotionPolicy;
  className?: string;
  fallback?: ReactNode;
  onReady?: () => void;
  children: ReactNode;
}

export const SIZE_PX: Record<Size, { width: number; height: number }> = {
  sm: { width: 320, height: 160 },
  md: { width: 600, height: 200 },
  lg: { width: 900, height: 300 },
  full: { width: 1200, height: 400 },
};
