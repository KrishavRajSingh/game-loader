import type { GameDefinition, GameId } from "../types.js";
import { DinoGame, dinoMeta } from "./dino/index.js";
import { SnakeGame, snakeMeta } from "./snake/index.js";
import { PongGame, pongMeta } from "./pong/index.js";

export const gameRegistry: Record<string, GameDefinition> = {
  dino: { meta: dinoMeta, Component: DinoGame },
  snake: { meta: snakeMeta, Component: SnakeGame },
  pong: { meta: pongMeta, Component: PongGame },
};

export function getGame(id: GameId): GameDefinition | undefined {
  return gameRegistry[id];
}

export function listGames(): GameDefinition[] {
  return Object.values(gameRegistry);
}
