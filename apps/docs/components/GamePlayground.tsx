"use client";

import { useState } from "react";
import { GameLoader, type GameId, type Size, type ThemeMode } from "@game-loader/react";

interface GamePlaygroundProps {
  game: GameId;
  description: string;
  initialLoading?: boolean;
  controls?: { keys: string; action: string }[];
}

const sizes: Size[] = ["sm", "md", "lg", "full"];
const themes: { value: ThemeMode; label: string }[] = [
  { value: "auto", label: "auto" },
  { value: "dark", label: "dark" },
  { value: "light", label: "light" },
];

const defaultControls: Record<GameId, { keys: string; action: string }[]> = {
  dino: [
    { keys: "Space / ↑ / W", action: "Jump" },
    { keys: "↓ / S (mid-jump)", action: "Fast fall" },
    { keys: "Click / Tap", action: "Jump" },
  ],
  snake: [
    { keys: "↑ ↓ ← →", action: "Steer" },
    { keys: "W A S D", action: "Steer" },
    { keys: "Swipe", action: "Steer" },
  ],
  pong: [
    { keys: "Mouse Y", action: "Move paddle" },
    { keys: "↑ ↓", action: "Move paddle" },
    { keys: "First to 7", action: "Wins" },
  ],
};

export function GamePlayground({
  game,
  description,
  initialLoading = true,
  controls = defaultControls[game] ?? [],
}: GamePlaygroundProps) {
  const [loading, setLoading] = useState(initialLoading);
  const [size, setSize] = useState<Size>("full");
  const [theme, setTheme] = useState<ThemeMode>("auto");
  const [showCode, setShowCode] = useState(false);

  const code = `<GameLoader
  loading={${loading}}
  game="${game}"
  size="${size}"
  theme="${theme}"
>
  <YourContent />
</GameLoader>`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">
        <div className="rounded-xl overflow-hidden border border-rule">
          <GameLoader loading={loading} game={game} size={size} theme={theme}>
            <div className="w-full h-full min-h-[200px] grid place-items-center bg-ink-2 text-muted">
              <span className="font-mono text-sm">
                Your real content would render here
              </span>
            </div>
          </GameLoader>
        </div>
        <aside className="bg-ink-2 border border-rule rounded-xl p-5 h-fit">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bulb mb-3">
            Controls
          </div>
          <ul className="space-y-2.5">
            {controls.map((c) => (
              <li
                key={c.keys}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <kbd className="font-mono text-[11px] text-foreground bg-ink border border-rule rounded px-1.5 py-0.5 whitespace-nowrap">
                  {c.keys}
                </kbd>
                <span className="text-muted text-xs text-right">{c.action}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setLoading((v) => !v)}
          className="bg-bulb text-ink font-medium px-4 py-2 rounded-full text-sm hover:bg-bulb-2 transition-colors"
        >
          {loading ? "Stop loading" : "Start loading"}
        </button>
        <div className="flex items-center gap-1 bg-ink-2 border border-rule rounded-full p-1">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                size === s
                  ? "bg-bulb text-ink"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-ink-2 border border-rule rounded-full p-1">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                theme === t.value
                  ? "bg-bulb text-ink"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCode((v) => !v)}
          className="border border-rule px-4 py-2 rounded-full text-sm hover:bg-ink-2 transition-colors"
        >
          {showCode ? "Hide code" : "Show code"}
        </button>
      </div>

      {showCode && (
        <pre className="bg-ink-2 border border-rule rounded-lg p-5 text-sm overflow-x-auto">
          <code className="font-mono">{code}</code>
        </pre>
      )}

      <p className="text-muted text-sm leading-relaxed max-w-2xl border-l-2 border-bulb pl-4">
        {description}
      </p>
    </div>
  );
}
