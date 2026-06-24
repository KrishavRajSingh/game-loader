import { useEffect, useRef } from "react";

/**
 * Custom animation frame loop with automatic cleanup, visibility pausing,
 * and a fixed-timestep tick that can be scaled for reduced motion.
 */
export function useGameLoop(
  enabled: boolean,
  tick: (dt: number) => void,
  options: { speed?: number } = {}
): void {
  const speed = options.speed ?? 1;
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    let raf = 0;
    let last = performance.now();
    let stopped = false;
    let paused = document.visibilityState !== "visible";

    const onVisibility = () => {
      paused = document.visibilityState !== "visible";
      if (!paused) last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const loop = (now: number) => {
      if (stopped) return;
      if (!paused) {
        const dt = Math.min(50, now - last);
        last = now;
        tickRef.current(dt * speed);
      } else {
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, speed]);
}
