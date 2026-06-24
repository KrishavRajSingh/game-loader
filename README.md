# game-loader

A monorepo containing:

- **`packages/game-loader`** — the publishable React library [`@game-loader/react`](./packages/game-loader) — drop-in mini-games that play while your data is loading.
- **`apps/docs`** — the [Next.js demo site](./apps/docs) — landing page, per-game playgrounds, and a sandbox that simulates a real fetch.

## Quickstart

```bash
pnpm install
pnpm dev          # starts the docs site at http://localhost:3000
pnpm build        # builds the lib + the site
pnpm test         # runs vitest in the library
pnpm typecheck    # tsc --noEmit across all workspaces
```

## Library

```tsx
import { GameLoader } from "@game-loader/react";

<GameLoader loading={isFetching} game="dino" size="md" theme="dark">
  <Dashboard />
</GameLoader>
```

Three games ship in v0.1: `dino`, `snake`, `pong`. See the [library README](./packages/game-loader/README.md) for the full API.

## Why this exists

The original `react-chrome-dino` repo is broken on modern React: it is React 16 + CRA, no TypeScript, no SSR, and its `requestAnimationFrame` loop never cleans up. `game-loader` is a modernized, extensible replacement that fixes those problems and ships more games out of the box.

## Layout

```
.
├── apps/docs/                  # Next.js 16 demo / docs site
└── packages/game-loader/       # @game-loader/react (publishable)
    └── src/
        ├── GameLoader.tsx
        ├── types.ts
        ├── games/
        │   ├── dino/
        │   ├── snake/
        │   └── pong/
        ├── theme/
        └── utils/
```
# game-loader
