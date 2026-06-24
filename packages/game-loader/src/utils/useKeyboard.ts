import { useEffect } from "react";

export type KeyHandler = (e: KeyboardEvent) => void;

export function useKeyboard(handler: KeyHandler, enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const wrapped = (e: KeyboardEvent) => handler(e);
    window.addEventListener("keydown", wrapped);
    return () => window.removeEventListener("keydown", wrapped);
  }, [handler, enabled]);
}
