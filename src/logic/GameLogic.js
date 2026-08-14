/**
 * GameLogic - Handles stat calculations and win/loss conditions
 */
export default class GameLogic {
  static isConditionMet(stats, condition) {
    const threshold = condition.threshold ?? 100;
    const direction = condition.direction || "atLeast";
    const statList = condition.stats || (condition.stat ? [condition.stat] : []);
    const mode = condition.mode || "any";

    const checks = statList.map((stat) => {
      const value = stats[stat] ?? 0;
      return direction === "atMost" ? value <= threshold : value >= threshold;
    });

    if (checks.length === 0) return false;
    return mode === "all" ? checks.every(Boolean) : checks.some(Boolean);
  }

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

  static checkWinConditions(stats, character, opponentCharacter) {
    if (!character || !opponentCharacter) {
      return { gameOver: false };
    }

    if (this.isConditionMet(stats, character.winCondition)) {
      return {
        gameOver: true,
        winner: character.displayName,
        reason: character.winCondition.message,
      };
    }

    if (this.isConditionMet(stats, character.loseCondition)) {
      return {
        gameOver: true,
        winner: opponentCharacter.displayName,
        reason: character.loseCondition.message,
      };
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
