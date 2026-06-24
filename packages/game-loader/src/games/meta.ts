import type { GameMeta } from "../types.js";
import { dinoMeta } from "./dino/meta.js";
import { snakeMeta } from "./snake/meta.js";
import { pongMeta } from "./pong/meta.js";

export type { GameMeta, GameId } from "../types.js";

export const gameMetaRegistry: Record<string, GameMeta> = {
  dino: dinoMeta,
  snake: snakeMeta,
  pong: pongMeta,
};

export function listGameMeta(): GameMeta[] {
  return Object.values(gameMetaRegistry);
}

export function getGameMeta(id: string): GameMeta | undefined {
  return gameMetaRegistry[id];
}

export { dinoMeta, snakeMeta, pongMeta };
