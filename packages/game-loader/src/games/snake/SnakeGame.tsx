import { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps, Size, ThemeTokens } from "../../types.js";
import { useGameLoop } from "../../utils/useGameLoop.js";
import { useKeyboard } from "../../utils/useKeyboard.js";
import { SIZE_PX } from "../../types.js";

export type Direction = "up" | "down" | "left" | "right";

export interface SnakeState {
  snake: { x: number; y: number }[];
  dir: Direction;
  queuedDir: Direction | null;
  food: { x: number; y: number };
  alive: boolean;
  score: number;
  tickAcc: number;
}

function getCanvas(size: Size): { w: number; h: number; cols: number; rows: number } {
  if (size === "full") return { w: 1200, h: 400, cols: 40, rows: 14 };
  const px = SIZE_PX[size];
  return { w: px.width, h: px.height, cols: 30, rows: 10 };
}

const TICK_MS = 110;

function randCell(cols: number, rows: number, exclude: { x: number; y: number }[]) {
  for (let tries = 0; tries < 50; tries++) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (!exclude.some((s) => s.x === x && s.y === y)) return { x, y };
  }
  return { x: 0, y: 0 };
}

function dirDelta(d: Direction): { dx: number; dy: number } {
  switch (d) {
    case "up":
      return { dx: 0, dy: -1 };
    case "down":
      return { dx: 0, dy: 1 };
    case "left":
      return { dx: -1, dy: 0 };
    case "right":
      return { dx: 1, dy: 0 };
  }
}

function opposite(a: Direction, b: Direction): boolean {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}

export function SnakeGame({ tokens, size, reducedMotion, paused, className }: GameProps) {
  const { w, h, cols, rows } = getCanvas(size);
  const cellW = w / cols;
  const cellH = h / rows;
  const tick = reducedMotion ? TICK_MS * 1.7 : TICK_MS;

  const [, force] = useState(0);
  const state = useRef<SnakeState>({
    snake: [
      { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2) },
      { x: Math.floor(cols / 2) - 2, y: Math.floor(rows / 2) },
      { x: Math.floor(cols / 2) - 3, y: Math.floor(rows / 2) },
    ],
    dir: "right",
    queuedDir: null,
    food: { x: Math.floor(cols / 2) + 4, y: Math.floor(rows / 2) },
    alive: true,
    score: 0,
    tickAcc: 0,
  });

  const reset = useCallback(() => {
    state.current = {
      snake: [
        { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2) },
        { x: Math.floor(cols / 2) - 2, y: Math.floor(rows / 2) },
        { x: Math.floor(cols / 2) - 3, y: Math.floor(rows / 2) },
      ],
      dir: "right",
      queuedDir: null,
      food: randCell(cols, rows, []),
      alive: true,
      score: 0,
      tickAcc: 0,
    };
    force((n) => n + 1);
  }, [cols, rows]);

  const queueDir = useCallback((d: Direction) => {
    const s = state.current;
    if (!s.alive) {
      reset();
      return;
    }
    const last = s.queuedDir ?? s.dir;
    if (opposite(last, d)) return;
    s.queuedDir = d;
  }, [reset]);

  useKeyboard(
    useCallback(
      (e: KeyboardEvent) => {
        const map: Record<string, Direction> = {
          ArrowUp: "up",
          ArrowDown: "down",
          ArrowLeft: "left",
          ArrowRight: "right",
          KeyW: "up",
          KeyS: "down",
          KeyA: "left",
          KeyD: "right",
        };
        const d = map[e.code];
        if (d) {
          e.preventDefault();
          queueDir(d);
        }
      },
      [queueDir]
    ),
    !paused
  );

  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const svg = document.querySelector("svg") as SVGSVGElement | null;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = t.clientX - cx;
      const dy = t.clientY - cy;
      if (Math.abs(dx) > Math.abs(dy)) queueDir(dx > 0 ? "right" : "left");
      else queueDir(dy > 0 ? "down" : "up");
    };
    const el = typeof document !== "undefined" ? document.querySelector("svg") : null;
    if (!el) return;
    el.addEventListener("touchstart", onTouch, { passive: true });
    return () => el.removeEventListener("touchstart", onTouch);
  }, [queueDir]);

  useGameLoop(
    !paused,
    useCallback(
      (dt: number) => {
        const s = state.current;
        if (!s.alive) {
          force((n) => n + 1);
          return;
        }
        s.tickAcc += dt;
        while (s.tickAcc >= tick) {
          s.tickAcc -= tick;
          if (s.queuedDir) {
            s.dir = s.queuedDir;
            s.queuedDir = null;
          }
          const { dx, dy } = dirDelta(s.dir);
          const head = s.snake[0]!;
          const next = { x: head.x + dx, y: head.y + dy };
          if (next.x < 0 || next.x >= cols || next.y < 0 || next.y >= rows) {
            s.alive = false;
            break;
          }
          if (s.snake.some((seg, i) => i < s.snake.length - 1 && seg.x === next.x && seg.y === next.y)) {
            s.alive = false;
            break;
          }
          s.snake.unshift(next);
          if (next.x === s.food.x && next.y === s.food.y) {
            s.score += 1;
            s.food = randCell(cols, rows, s.snake);
          } else {
            s.snake.pop();
          }
        }
        force((n) => n + 1);
      },
      [tick, cols, rows]
    )
  );

  const s = state.current;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ display: "block", userSelect: "none" }}
      role="img"
      aria-label={`Snake, score ${s.score}`}
    >
      <rect x={0} y={0} width={w} height={h} fill={tokens.surface} />
      {Array.from({ length: cols }).map((_, x) =>
        Array.from({ length: rows }).map((_, y) =>
          (x + y) % 2 === 0 ? (
            <rect
              key={`${x}-${y}`}
              x={x * cellW}
              y={y * cellH}
              width={cellW}
              height={cellH}
              fill={tokens.border}
              opacity={0.35}
            />
          ) : null
        )
      )}
      <rect
        x={s.food.x * cellW + cellW * 0.15}
        y={s.food.y * cellH + cellH * 0.15}
        width={cellW * 0.7}
        height={cellH * 0.7}
        rx={cellW * 0.3}
        fill={tokens.accent}
      />
      {s.snake.map((seg, i) => {
        const isHead = i === 0;
        return (
          <rect
            key={i}
            x={seg.x * cellW + cellW * 0.08}
            y={seg.y * cellH + cellH * 0.08}
            width={cellW * 0.84}
            height={cellH * 0.84}
            rx={cellW * 0.25}
            fill={isHead ? tokens.foreground : tokens.primary}
            opacity={isHead ? 1 : 1 - i / (s.snake.length + 4)}
          />
        );
      })}

      <text
        x={w - 16}
        y={28}
        textAnchor="end"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={18}
        fontWeight={700}
        fill={tokens.foreground}
      >
        {s.score}
      </text>

      {!s.alive && (
        <g>
          <rect
            x={w / 2 - 130}
            y={h / 2 - 36}
            width={260}
            height={72}
            rx={8}
            fill={tokens.surface}
            stroke={tokens.foreground}
            strokeWidth={2}
            opacity={0.92}
          />
          <text
            x={w / 2}
            y={h / 2 - 4}
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize={18}
            fontWeight={700}
            fill={tokens.foreground}
          >
            GAME OVER · {s.score}
          </text>
          <text
            x={w / 2}
            y={h / 2 + 22}
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize={12}
            fill={tokens.muted}
          >
            Press an arrow key to restart
          </text>
        </g>
      )}
    </svg>
  );
}
