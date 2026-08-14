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

  /**
   * Each player has their own stats object, so both must be passed. A single
   * shared object cannot express the game: both characters lose on `pressure`,
   * and only the owner of that value decides who it belongs to.
   *
   * Returns "player" or "opponent" — the same vocabulary BattleScene.gameOver()
   * expects, so it can call this directly instead of duplicating the checks.
   */
  static checkWinConditions(playerStats, opponentStats, playerCharacter, opponentCharacter) {
    const checks = [
      [playerStats, playerCharacter.winCondition, "player"],
      [playerStats, playerCharacter.loseCondition, "opponent"],
      [opponentStats, opponentCharacter.winCondition, "opponent"],
      [opponentStats, opponentCharacter.loseCondition, "player"],
    ];

    for (const [stats, condition, winner] of checks) {
      if (stats[condition.stat] >= condition.threshold) {
        return { gameOver: true, winner, reason: condition.message };
      }
    }

    return { gameOver: false };
  }

  /**
   * Determines which card resolves first based on card type and speed
   * @param {Object} playerCard - The player's card
   * @param {Object} aiCard - The AI's card
   * @returns {string} 'player', 'ai', or 'none'
   */
  static determineResolutionOrder(playerCard, aiCard) {
    // If both passed, return none
    if (!playerCard && !aiCard) return 'none';
    
    // If only one card played, that one resolves
    if (!playerCard) return 'ai';
    if (!aiCard) return 'player';

    // Check for COUNTER cards - they always resolve first
    const playerIsCounter = playerCard.cardType === "COUNTER";
    const aiIsCounter = aiCard.cardType === "COUNTER";

    if (playerIsCounter && !aiIsCounter) {
      return 'player';
    } else if (aiIsCounter && !playerIsCounter) {
      return 'ai';
    }

    // If both are counters OR neither are counters, compare speeds
    const playerSpeed = playerCard.speed || 0;
    const aiSpeed = aiCard.speed || 0;

    if (playerSpeed > aiSpeed) {
      return 'player';
    } else if (aiSpeed > playerSpeed) {
      return 'ai';
    } else {
      // Same speed - player goes first (tie breaker)
      return 'player';
    }
  }
}
