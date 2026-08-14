import { describe, it, expect } from "vitest";
import { characters, getCharacter, getOpponent } from "./characters.js";

const STATS = ["investigation", "morale", "publicOpinion", "pressure"];

describe("character definitions", () => {
  Object.values(characters).forEach((character) => {
    it(`${character.displayName} defines all four stats`, () => {
      STATS.forEach((stat) => {
        expect(character.statLabels[stat]).toBeTruthy();
        expect(character.statColors[stat]).toHaveProperty("isGreen");
      });
    });

    it(`${character.displayName} colour values match their isGreen flag`, () => {
      STATS.forEach((stat) => {
        const { color, isGreen } = character.statColors[stat];
        expect(color).toBe(isGreen ? 0x00ff00 : 0xff4444);
      });
    });

    it(`${character.displayName} win and lose conditions name real stats`, () => {
      character.winCondition.stats.forEach((stat) => {
        expect(STATS).toContain(stat);
      });
      character.loseCondition.stats.forEach((stat) => {
        expect(STATS).toContain(stat);
      });
      expect(character.winCondition.mode).toBe("all");
      expect(character.loseCondition.mode).toBe("any");
      expect(character.winCondition.threshold).toBe(100);
      expect(character.loseCondition.threshold).toBe(100);
    });
  });

  it("getOpponent returns the other character", () => {
    expect(getOpponent("Independent Detective").id).toBe("vigilante");
    expect(getOpponent("Vigilante").id).toBe("detective");
    expect(getOpponent("nobody")).toBeNull();
  });

  it("getCharacter looks up by full name", () => {
    expect(getCharacter("Vigilante").displayName).toBe("Vigilante");
  });
});
