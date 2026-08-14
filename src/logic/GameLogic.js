import { characters, getOpponent } from "../data/characters.js";

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
   * Win/lose conditions are defined per character in characters.js. Reading
   * them from there keeps one source of truth — this used to hardcode both the
   * thresholds and the winner names, which drifted from the definitions.
   */
  static checkWinConditions(stats) {
    for (const character of Object.values(characters)) {
      const { winCondition, loseCondition } = character;

      if (stats[winCondition.stat] >= winCondition.threshold) {
        return {
          gameOver: true,
          winner: character.displayName,
          reason: winCondition.message,
        };
      }

      if (stats[loseCondition.stat] >= loseCondition.threshold) {
        return {
          gameOver: true,
          winner: getOpponent(character.name).displayName,
          reason: loseCondition.message,
        };
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
