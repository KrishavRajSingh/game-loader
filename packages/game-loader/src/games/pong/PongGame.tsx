import { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps, Size, ThemeTokens } from "../../types.js";
import { useGameLoop } from "../../utils/useGameLoop.js";
import { useKeyboard } from "../../utils/useKeyboard.js";
import { SIZE_PX } from "../../types.js";

export interface PongState {
  ball: { x: number; y: number; vx: number; vy: number };
  leftY: number;
  rightY: number;
  leftScore: number;
  rightScore: number;
  serveTimer: number;
  serveTo: "left" | "right";
  winner: "left" | "right" | null;
  paddleTarget: number;
}

function getCanvas(size: Size): { w: number; h: number } {
  if (size === "full") return { w: 1200, h: 400 };
  const px = SIZE_PX[size];
  return { w: px.width, h: px.height };
}

const PADDLE_H_RATIO = 0.2;
const WIN_SCORE = 7;
const SERVE_DELAY = 700;

export function PongGame({ tokens, size, reducedMotion, paused, className }: GameProps) {
  const { w, h } = getCanvas(size);
  const paddleH = h * PADDLE_H_RATIO;
  const paddleW = w * 0.012;
  const ballR = Math.max(6, h * 0.018);
  const speedFactor = reducedMotion ? 0.7 : 1;

  const [, force] = useState(0);
  const state = useRef<PongState>({
    ball: { x: w / 2, y: h / 2, vx: 0, vy: 0 },
    leftY: h / 2 - paddleH / 2,
    rightY: h / 2 - paddleH / 2,
    leftScore: 0,
    rightScore: 0,
    serveTimer: SERVE_DELAY,
    serveTo: "right",
    winner: null,
    paddleTarget: h / 2 - paddleH / 2,
  });

  const reset = useCallback((to: "left" | "right") => {
    const s = state.current;
    s.ball = { x: w / 2, y: h / 2, vx: 0, vy: 0 };
    s.serveTimer = SERVE_DELAY;
    s.serveTo = to;
  }, [w, h]);

  const keys = useRef<{ up: boolean; down: boolean }>({ up: false, down: false });
  useKeyboard(
    useCallback((e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") keys.current.up = e.type === "keydown";
      if (e.code === "ArrowDown" || e.code === "KeyS") keys.current.down = e.type === "keydown";
    }, []),
    !paused
  );
  useEffect(() => {
    const onKey = (down: boolean) => (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") keys.current.up = down;
      if (e.code === "ArrowDown" || e.code === "KeyS") keys.current.down = down;
    };
    const u = onKey(true);
    const d = onKey(false);
    window.addEventListener("keydown", u);
    window.addEventListener("keyup", d);
    return () => {
      window.removeEventListener("keydown", u);
      window.removeEventListener("keyup", d);
    };
  }, []);

  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const y = ((e.clientY - rect.top) / rect.height) * h;
      state.current.paddleTarget = Math.max(0, Math.min(h - paddleH, y - paddleH / 2));
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = el.getBoundingClientRect();
      const y = ((t.clientY - rect.top) / rect.height) * h;
      state.current.paddleTarget = Math.max(0, Math.min(h - paddleH, y - paddleH / 2));
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onTouch);
    };
  }, [h, paddleH]);

  useGameLoop(
    !paused,
    useCallback(
      (dt: number) => {
        const s = state.current;
        const sp = speedFactor;

        if (keys.current.up) s.paddleTarget -= 0.9 * dt * sp;
        if (keys.current.down) s.paddleTarget += 0.9 * dt * sp;
        s.paddleTarget = Math.max(0, Math.min(h - paddleH, s.paddleTarget));
        s.leftY += (s.paddleTarget - s.leftY) * Math.min(1, dt * 0.02);

        const aiTarget = s.ball.y - paddleH / 2;
        const aiSpeed = 0.55 * dt * sp;
        if (s.rightY < aiTarget) s.rightY = Math.min(aiTarget, s.rightY + aiSpeed);
        else s.rightY = Math.max(aiTarget, s.rightY - aiSpeed);
        s.rightY = Math.max(0, Math.min(h - paddleH, s.rightY));

        if (s.serveTimer > 0) {
          s.serveTimer -= dt;
          if (s.serveTimer <= 0) {
            const dir = s.serveTo === "left" ? -1 : 1;
            s.ball.vx = dir * (0.35 + Math.random() * 0.1) * sp;
            s.ball.vy = (Math.random() - 0.5) * 0.3 * sp;
          }
          force((n) => n + 1);
          return;
        }

        s.ball.x += s.ball.vx * dt;
        s.ball.y += s.ball.vy * dt;

        if (s.ball.y < ballR) {
          s.ball.y = ballR;
          s.ball.vy = Math.abs(s.ball.vy);
        }
        if (s.ball.y > h - ballR) {
          s.ball.y = h - ballR;
          s.ball.vy = -Math.abs(s.ball.vy);
        }

        const lx = 20;
        if (
          s.ball.x - ballR < lx + paddleW &&
          s.ball.x + ballR > lx &&
          s.ball.y > s.leftY &&
          s.ball.y < s.leftY + paddleH
        ) {
          s.ball.x = lx + paddleW + ballR;
          const rel = (s.ball.y - (s.leftY + paddleH / 2)) / (paddleH / 2);
          s.ball.vx = Math.abs(s.ball.vx) * 1.05;
          s.ball.vy = rel * 0.45 * sp;
        }
        const rx = w - 20 - paddleW;
        if (
          s.ball.x + ballR > rx &&
          s.ball.x - ballR < rx + paddleW &&
          s.ball.y > s.rightY &&
          s.ball.y < s.rightY + paddleH
        ) {
          s.ball.x = rx - ballR;
          const rel = (s.ball.y - (s.rightY + paddleH / 2)) / (paddleH / 2);
          s.ball.vx = -Math.abs(s.ball.vx) * 1.05;
          s.ball.vy = rel * 0.45 * sp;
        }

        if (s.ball.x < -ballR * 2) {
          s.rightScore += 1;
          if (s.rightScore >= WIN_SCORE) s.winner = "right";
          else reset("left");
        } else if (s.ball.x > w + ballR * 2) {
          s.leftScore += 1;
          if (s.leftScore >= WIN_SCORE) s.winner = "left";
          else reset("right");
        }

        force((n) => n + 1);
      },
      [w, h, paddleH, paddleW, ballR, speedFactor, reset]
    )
  );

  const s = state.current;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ display: "block", userSelect: "none", touchAction: "none", cursor: "none" }}
      role="img"
      aria-label={`Pong, ${s.leftScore} to ${s.rightScore}`}
    >
      <rect x={0} y={0} width={w} height={h} fill={tokens.surface} />
      <line
        x1={w / 2}
        y1={0}
        x2={w / 2}
        y2={h}
        stroke={tokens.muted}
        strokeWidth={2}
        strokeDasharray={`${h * 0.04} ${h * 0.04}`}
        opacity={0.6}
      />
      <rect
        x={20}
        y={s.leftY}
        width={paddleW}
        height={paddleH}
        rx={paddleW / 2}
        fill={tokens.foreground}
      />
      <rect
        x={w - 20 - paddleW}
        y={s.rightY}
        width={paddleW}
        height={paddleH}
        rx={paddleW / 2}
        fill={tokens.foreground}
      />
      <rect
        x={s.ball.x - ballR}
        y={s.ball.y - ballR}
        width={ballR * 2}
        height={ballR * 2}
        rx={ballR}
        fill={tokens.accent}
      />
      <text
        x={w / 2 - 24}
        y={56}
        textAnchor="end"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={42}
        fontWeight={700}
        fill={tokens.foreground}
        opacity={0.5}
      >
        {s.leftScore}
      </text>
      <text
        x={w / 2 + 24}
        y={56}
        textAnchor="start"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={42}
        fontWeight={700}
        fill={tokens.foreground}
        opacity={0.5}
      >
        {s.rightScore}
      </text>
      {s.winner && (
        <g>
          <rect
            x={w / 2 - 140}
            y={h / 2 - 36}
            width={280}
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
            {s.winner === "left" ? "YOU WIN" : "CPU WINS"}
          </text>
          <text
            x={w / 2}
            y={h / 2 + 22}
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize={12}
            fill={tokens.muted}
          >
            Refresh to play again
          </text>
        </g>
      )}
    </svg>
  );
}
