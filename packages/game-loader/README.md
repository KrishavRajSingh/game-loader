# @game-loader/react

Interactive mini-game loaders for React. While your data fetches, the user plays a quick game — dino runner, snake, or pong. When the data lands, the game is replaced by the real content.

- **Zero assets** — all graphics are inline SVG. No network requests, no flash of empty loader.
- **SSR-safe** — games render on the server; the game loop only starts on the client.
- **Themeable** — light, dark, or pass your own color tokens.
- **A11y** — `role="status"`, `aria-busy`, `aria-live`, honors `prefers-reduced-motion`.
- **Tree-shakeable** — import just one game if you don't need the wrapper.
- **Tiny** — no runtime dependencies, peer-depends only on `react` and `react-dom`.

## Install

```bash
pnpm add @game-loader/react
# or npm install / yarn add
```

## Usage

```tsx
import { GameLoader } from "@game-loader/react";

function Dashboard({ data, isLoading }) {
  return (
    <GameLoader loading={isLoading} game="dino" size="md" theme="dark">
      <DashboardView data={data} />
    </GameLoader>
  );
}
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `boolean` | — | Show the game when `true`, the children when `false`. |
| `game` | `"dino" \| "snake" \| "pong"` | — | Which game to play. |
| `theme` | `"light" \| "dark" \| "auto" \| ThemeTokens` | `"auto"` | Color theme. Pass a partial token object to brand it. |
| `size` | `"sm" \| "md" \| "lg" \| "full"` | `"md"` | Container size. `"full"` stretches to parent. |
| `reducedMotion` | `"honor" \| "play"` | `"honor"` | If `"honor"`, slows down when the OS asks for reduced motion. |
| `onReady` | `() => void` | — | Fires once the first game frame has been requested. |
| `fallback` | `ReactNode` | — | Render this instead of the game. |
| `className` | `string` | — | Class on the outer container. |

### Using a single game directly

```tsx
import { DinoGame } from "@game-loader/react/games/dino";
import { darkTokens } from "@game-loader/react";

<DinoGame tokens={darkTokens} size="lg" />
```

### With Suspense

```tsx
import { Suspense } from "react";
import { GameLoader } from "@game-loader/react";

<Suspense fallback={<GameLoader.Loading game="snake" />}>
  <SlowData />
</Suspense>
```

## Adding a new game

Each game is a `GameDefinition` registered in `src/games/registry.ts`. Implement the contract:

```ts
import type { GameProps } from "@game-loader/react";

export function MyGame({ tokens, size, reducedMotion, paused }: GameProps) {
  // ... your game loop, return SVG/Canvas
}
```

Then register it:

```ts
// src/games/registry.ts
export const gameRegistry = {
  // ...
  myGame: { meta: { id: "myGame", displayName: "My Game", ... }, Component: MyGame },
};
```

## License

MIT
