import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameLoader, listGames, gameRegistry, darkTokens } from "../src/index.js";

describe("GameLoader", () => {
  it("renders children when not loading", () => {
    render(
      <GameLoader loading={false} game="dino">
        <div>content</div>
      </GameLoader>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders the dino game when loading", () => {
    render(
      <GameLoader loading={true} game="dino">
        <div>content</div>
      </GameLoader>
    );
    expect(screen.queryByText("content")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the snake game when loading", () => {
    render(
      <GameLoader loading={true} game="snake">
        <div>content</div>
      </GameLoader>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the pong game when loading", () => {
    render(
      <GameLoader loading={true} game="pong">
        <div>content</div>
      </GameLoader>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("falls back to a placeholder for unknown games", () => {
    render(
      <GameLoader loading={true} game="unknown">
        <div>content</div>
      </GameLoader>
    );
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("exposes dark tokens by default for auto theme", () => {
    expect(darkTokens.surface).toMatch(/^#/);
  });
});

describe("registry", () => {
  it("registers all three default games", () => {
    expect(Object.keys(gameRegistry).sort()).toEqual(["dino", "pong", "snake"]);
  });

  it("lists all games with metadata", () => {
    const games = listGames();
    expect(games.length).toBe(3);
    for (const g of games) {
      expect(g.meta.id).toBeTruthy();
      expect(g.meta.displayName).toBeTruthy();
      expect(g.meta.description).toBeTruthy();
    }
  });
});
