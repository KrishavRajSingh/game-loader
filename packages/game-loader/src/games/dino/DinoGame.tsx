import type { GameProps } from "../../types.js";
// react-chrome-dino renders a fixed 600×150 canvas via a global `Runner`
// class on `window`. It's a React 16-era class component with a leaky
// rAF loop (per our README's "why this exists" section), hard-coded
// colors, no theming, and no `paused` / `Size` / `tokens` support.
// We accept those trade-offs because the user asked for the proven
// package instead of our port.
import ChromeDinoComponent from "react-chrome-dino";

export interface DinoGameProps extends GameProps {
  sound?: boolean;
}

export function DinoGame({ tokens, paused, className }: DinoGameProps) {
  // The Runner singleton leaks its rAF loop on unmount, so the only
  // way to actually stop the game when loading finishes is to remove
  // the DOM the Runner bound to. Returning null on pause gives us that
  // for free.
  if (paused) return null;

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: tokens.surface,
        overflow: "hidden",
        // Don't use flex here — react-chrome-dino sizes its canvas off
        // `.interstitial-wrapper.offsetWidth`, and a flex item collapses
        // to 0 width on the first paint. A block layout keeps the wrapper
        // at the full container width.
        display: "block",
        position: "relative",
      }}
    >
      <ChromeDinoComponent />
    </div>
  );
}
