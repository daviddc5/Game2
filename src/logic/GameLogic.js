/**
 * GameLogic - Handles stat calculations and win/loss conditions
 */
export default class GameLogic {
  static clampStat(value) {
    return Math.max(0, Math.min(100, value));
  }

  static applyEffects(currentStats, effects) {
    const newStats = { ...currentStats };

    Object.keys(effects).forEach((stat) => {
      if (newStats.hasOwnProperty(stat)) {
        newStats[stat] = this.clampStat(newStats[stat] + effects[stat]);
      }
    });

    return newStats;
  }

  static checkWinConditions(stats) {
    // Check L win condition
    if (stats.evidence >= 100) {
      return {
        gameOver: true,
        winner: "Detective L",
        reason: "Evidence reached 100!",
      };
    }

    // Check L loss condition
    if (stats.morale >= 100) {
      return {
        gameOver: true,
        winner: "Kira",
        reason: "L's Morale collapsed!",
      };
    }

    // Check Kira win condition
    if (stats.justiceInfluence >= 100) {
      return {
        gameOver: true,
        winner: "Kira",
        reason: "Justice Influence reached 100!",
      };
    }

    // Check Kira loss condition
    if (stats.suspicion >= 100) {
      return {
        gameOver: true,
        winner: "Detective L",
        reason: "Kira's Suspicion too high!",
      };
    }

    return { gameOver: false };
  }
}
