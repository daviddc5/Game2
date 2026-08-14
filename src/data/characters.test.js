import { describe, it, expect } from "vitest";
import { characters, getOpponent } from "./characters.js";

/**
 * The four stats are shared between both characters — only the labels differ.
 * Whether a stat rising is good or bad for a given character is fully
 * determined by the win/lose conditions, so we derive the expectation rather
 * than hardcoding it. If the conditions change, these tests follow.
 */
function expectedIsGreen(character, stat) {
  const opponent = getOpponent(character.name);
  if (stat === character.winCondition.stat) return true; // rising wins me the game
  if (stat === character.loseCondition.stat) return false; // rising loses me the game
  if (stat === opponent.winCondition.stat) return false; // rising wins them the game
  if (stat === opponent.loseCondition.stat) return true; // rising loses them the game
  throw new Error(`${stat} is not referenced by any win/lose condition`);
}

const names = Object.keys(characters);
const STATS = ["investigation", "morale", "publicOpinion", "pressure"];

describe("character stat colours", () => {
  names.forEach((name) => {
    const character = characters[name];

    STATS.forEach((stat) => {
      it(`${character.displayName}: ${stat} colour matches whether rising it helps them`, () => {
        const expected = expectedIsGreen(character, stat);
        expect(
          character.statColors[stat].isGreen,
          `"${character.statLabels[stat]}" is rendered ${
            character.statColors[stat].isGreen ? "green" : "red"
          } but rising it ${expected ? "helps" : "hurts"} the ${character.displayName}`,
        ).toBe(expected);
      });
    });

    it(`${character.displayName}: green stats are actually green, red stats actually red`, () => {
      STATS.forEach((stat) => {
        const { color, isGreen } = character.statColors[stat];
        expect(color, `${stat} colour value disagrees with its isGreen flag`).toBe(
          isGreen ? 0x00ff00 : 0xff4444,
        );
      });
    });

    it(`${character.displayName}: positiveStats/negativeStats agree with win/lose conditions`, () => {
      expect(character.positiveStats).toContain(character.winCondition.stat);
      expect(character.negativeStats).toContain(character.loseCondition.stat);
    });
  });

});
