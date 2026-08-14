import { describe, it, expect } from "vitest";
import GameLogic from "./GameLogic.js";
import { characters } from "../data/characters.js";

const detective = characters["Independent Detective"];
const vigilante = characters["Vigilante"];
const START = { investigation: 0, morale: 50, publicOpinion: 0, pressure: 0 };

describe("win/lose conditions read the way their labels do", () => {
  it("a fresh match is not already over", () => {
    expect(GameLogic.isConditionMet(START, detective.winCondition)).toBe(false);
    expect(GameLogic.isConditionMet(START, detective.loseCondition)).toBe(false);
    expect(GameLogic.isConditionMet(START, vigilante.winCondition)).toBe(false);
    expect(GameLogic.isConditionMet(START, vigilante.loseCondition)).toBe(false);
  });

  it("Detective wins only when both green stats reach 100", () => {
    expect(GameLogic.isConditionMet({ ...START, investigation: 100 }, detective.winCondition)).toBe(false);
    expect(GameLogic.isConditionMet({ ...START, morale: 100 }, detective.winCondition)).toBe(false);
    expect(
      GameLogic.isConditionMet({ ...START, investigation: 100, morale: 100 }, detective.winCondition),
    ).toBe(true);
  });

  it("Detective loses when any red stat reaches 100", () => {
    expect(GameLogic.isConditionMet({ ...START, publicOpinion: 100 }, detective.loseCondition)).toBe(true);
    expect(GameLogic.isConditionMet({ ...START, pressure: 100 }, detective.loseCondition)).toBe(true);
  });

  it("Vigilante wins only when both green stats reach 100", () => {
    expect(GameLogic.isConditionMet({ ...START, morale: 100 }, vigilante.winCondition)).toBe(false);
    expect(GameLogic.isConditionMet({ ...START, publicOpinion: 100 }, vigilante.winCondition)).toBe(false);
    expect(
      GameLogic.isConditionMet({ ...START, morale: 100, publicOpinion: 100 }, vigilante.winCondition),
    ).toBe(true);
  });

  it("Vigilante loses when any red stat reaches 100", () => {
    expect(GameLogic.isConditionMet({ ...START, investigation: 100 }, vigilante.loseCondition)).toBe(true);
    expect(GameLogic.isConditionMet({ ...START, pressure: 100 }, vigilante.loseCondition)).toBe(true);
  });

  it("green stats never trigger lose conditions by themselves", () => {
    Object.values(characters).forEach((character) => {
      Object.entries(character.statColors).forEach(([stat, { isGreen }]) => {
        if (!isGreen) return;
        const maxed = { ...START, [stat]: 100 };
        expect(
          GameLogic.isConditionMet(maxed, character.loseCondition),
          `${character.displayName}: filling green stat "${character.statLabels[stat]}" ends the match in defeat`,
        ).toBe(false);
      });
    });
  });
});
