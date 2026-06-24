import { useMemo } from "react";
import {
  brandTokens,
  darkTokens,
  lightTokens,
} from "./tokens.js";
import type { ThemeMode, ThemeTokens } from "../types.js";

function isTokens(value: unknown): value is Partial<ThemeTokens> {
  return typeof value === "object" && value !== null;
}

export function useThemeTokens(
  theme: ThemeMode | Partial<ThemeTokens> | undefined
): ThemeTokens {
  return useMemo<ThemeTokens>(() => {
    if (!theme || theme === "auto") return darkTokens;
    if (theme === "light") return lightTokens;
    if (theme === "dark") return darkTokens;
    if (isTokens(theme)) {
      return { ...brandTokens, ...theme };
    }
    return darkTokens;
  }, [theme]);
}
