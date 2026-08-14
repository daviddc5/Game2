import { describe, it, expect } from "vitest";
import GameLogic from "./GameLogic.js";
import { characters } from "../data/characters.js";

const zero = { investigation: 0, morale: 0, publicOpinion: 0, pressure: 0 };
const detective = characters["Independent Detective"];
const vigilante = characters["Vigilante"];

describe("clampStat", () => {
  it("holds values inside 0-100", () => {
    expect(GameLogic.clampStat(150)).toBe(100);
    expect(GameLogic.clampStat(-20)).toBe(0);
    expect(GameLogic.clampStat(42)).toBe(42);
  });
});

describe("applyEffects", () => {
  it("adds effects and clamps the result", () => {
    expect(GameLogic.applyEffects({ ...zero, investigation: 95 }, { investigation: 20 }))
      .toMatchObject({ investigation: 100 });
  });

  it("ignores stats that do not exist", () => {
    expect(GameLogic.applyEffects({ ...zero }, { nonsense: 50 })).toEqual(zero);
  });

  it("does not mutate the stats passed in", () => {
    const before = { ...zero };
    GameLogic.applyEffects(before, { investigation: 10 });
    expect(before.investigation).toBe(0);
  });
});

describe("checkWinConditions", () => {
  it("is not over while every stat is below 100", () => {
    expect(GameLogic.checkWinConditions({ ...zero, investigation: 99 }).gameOver).toBe(false);
  });

  // Each character's own definition is the source of truth for who wins.
  [
    [detective, "winCondition", detective],
    [detective, "loseCondition", vigilante],
    [vigilante, "winCondition", vigilante],
    [vigilante, "loseCondition", detective],
  ].forEach(([character, condition, expectedWinner]) => {
    const stat = character[condition].stat;
    it(`${character.displayName} ${condition} on "${stat}" makes ${expectedWinner.displayName} the winner`, () => {
      const result = GameLogic.checkWinConditions({ ...zero, [stat]: 100 });
      expect(result.gameOver).toBe(true);
      expect(result.winner).toBe(expectedWinner.displayName);
    });
  });

  it("never reports a winner name that is not a defined character", () => {
    const valid = Object.values(characters).map((c) => c.displayName);
    ["investigation", "morale", "publicOpinion", "pressure"].forEach((stat) => {
      const { winner } = GameLogic.checkWinConditions({ ...zero, [stat]: 100 });
      expect(valid, `"${winner}" is not a character in characters.js`).toContain(winner);
    });
  });
});

describe("determineResolutionOrder", () => {
  const counter = { cardType: "COUNTER", speed: 10 };
  const power = { cardType: "POWER", speed: 2 };
  const quick = { cardType: "QUICK", speed: 8 };

  it("resolves a counter before a slower non-counter", () => {
    expect(GameLogic.determineResolutionOrder(counter, power)).toBe("player");
    expect(GameLogic.determineResolutionOrder(power, counter)).toBe("ai");
  });

  it("falls back to speed when neither or both are counters", () => {
    expect(GameLogic.determineResolutionOrder(quick, power)).toBe("player");
    expect(GameLogic.determineResolutionOrder(power, quick)).toBe("ai");
  });

  it("breaks a speed tie in the player's favour", () => {
    expect(GameLogic.determineResolutionOrder(quick, { ...quick })).toBe("player");
  });

  it("handles a passed turn on either side", () => {
    expect(GameLogic.determineResolutionOrder(null, power)).toBe("ai");
    expect(GameLogic.determineResolutionOrder(power, null)).toBe("player");
    expect(GameLogic.determineResolutionOrder(null, null)).toBe("none");
  });
});
