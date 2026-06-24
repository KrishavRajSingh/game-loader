export { GameLoader } from "./GameLoader.js";
export { getGame, listGames, gameRegistry } from "./games/registry.js";
export { getGameMeta, listGameMeta, gameMetaRegistry } from "./games/meta.js";
export { DinoGame } from "./games/dino/index.js";
export { SnakeGame } from "./games/snake/index.js";
export { PongGame } from "./games/pong/index.js";
export { usePrefersReducedMotion } from "./utils/usePrefersReducedMotion.js";

export type {
  GameId,
  Size,
  ThemeMode,
  ThemeTokens,
  GameMeta,
  GameProps,
  GameDefinition,
  GameLoaderProps,
  ReducedMotionPolicy,
} from "./types.js";

export { SIZE_PX } from "./types.js";
export { lightTokens, darkTokens, brandTokens } from "./theme/tokens.js";
