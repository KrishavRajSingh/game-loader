import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement HTMLCanvasElement.getContext() — it returns null.
// The react-chrome-dino component (which we now use for the dino game)
// tries to draw on the canvas on mount and crashes in tests. Mock
// getContext() to return a Proxy that no-ops every property access and
// assignment so the Runner script can finish its `init()` and `loadImages()`
// without touching real rendering.
HTMLCanvasElement.prototype.getContext = function () {
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        // Common string-valued properties (style/font/align).
        if (
          prop === "fillStyle" ||
          prop === "strokeStyle" ||
          prop === "font" ||
          prop === "textAlign" ||
          prop === "textBaseline" ||
          prop === "globalAlpha" ||
          prop === "lineWidth" ||
          prop === "direction"
        ) {
          return "";
        }
        // Anything callable becomes a no-op.
        return () => undefined;
      },
      set: () => true,
    }
  );
};
