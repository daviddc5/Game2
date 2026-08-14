import { describe, it, expect } from "vitest";
import { characters } from "./characters.js";

/**
 * Each character has their OWN set of four stats — playerStats and
 * opponentStats are separate objects, each panel labelled from its own
 * character. Only two of the four decide the match: the character's
 * winCondition stat and their loseCondition stat. The other two have no
 * win/lose role and only affect the deck-exhaustion tiebreak, so their
 * colour is a design choice we cannot derive.
 */
function decisiveColour(character, stat) {
  if (stat === character.winCondition.stat) return true; // rising wins me the game
  if (stat === character.loseCondition.stat) return false; // rising loses me the game
  return null; // no win/lose role — not derivable
}

const names = Object.keys(characters);
const STATS = ["investigation", "morale", "publicOpinion", "pressure"];

describe("character stat colours", () => {
  names.forEach((name) => {
    const character = characters[name];

    STATS.forEach((stat) => {
      it(`${character.displayName}: ${stat} colour matches its win/lose role`, () => {
        const expected = decisiveColour(character, stat);
        if (expected === null) return; // design choice, nothing to assert
        expect(
          character.statColors[stat].isGreen,
          `"${character.statLabels[stat]}" is rendered ${
            character.statColors[stat].isGreen ? "green" : "red"
          } but rising it ${expected ? "WINS" : "LOSES"} the ${character.displayName} the match`,
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
