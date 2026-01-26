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
    if (stats.investigation >= 100) {
      return {
        gameOver: true,
        winner: "Detective L",
        reason: "Investigation complete!",
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
    if (stats.publicOpinion >= 100) {
      return {
        gameOver: true,
        winner: "Kira",
        reason: "Public Opinion reached 100!",
      };
    }

    // Check Kira loss condition
    if (stats.pressure >= 100) {
      return {
        gameOver: true,
        winner: "Detective L",
        reason: "Pressure too high!",
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
