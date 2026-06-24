import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "games/meta": "src/games/meta.ts",
    "games/dino": "src/games/dino/index.ts",
    "games/snake": "src/games/snake/index.ts",
    "games/pong": "src/games/pong/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  target: "es2020",
  splitting: false,
});
