import { useEffect, useRef } from "react";

export function useVisibility(onChange: (visible: boolean) => void): void {
  const cb = useRef(onChange);
  cb.current = onChange;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = () => cb.current(document.visibilityState === "visible");
    handler();
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);
}
