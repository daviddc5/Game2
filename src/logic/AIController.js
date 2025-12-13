/**
 * AIController - Handles AI decision making
 */
export default class AIController {
  constructor(character, stats) {
    this.character = character;
    this.stats = stats;
  }

  chooseBestCard(cards) {
    const positiveStats = this.character.positiveStats;
    const negativeStats = this.character.negativeStats;

    // Score each card
    const scoredCards = cards.map((card) => {
      let score = this.scoreCard(card, positiveStats, negativeStats);
      return { card, score };
    });

    // Sort by score (highest first)
    scoredCards.sort((a, b) => b.score - a.score);

    console.log(
      "AI card scores:",
      scoredCards.map((sc) => `${sc.card.name}: ${sc.score}`)
    );

    return scoredCards[0].card;
  }

  scoreCard(card, positiveStats, negativeStats) {
    let score = 0;
    const effects = card.effects;

    // Reward cards that increase AI's positive stats
    positiveStats.forEach((stat) => {
      score += effects[stat] * 2; // 2x weight
    });

    // Reward cards that decrease AI's negative stats
    negativeStats.forEach((stat) => {
      score -= effects[stat] * 2; // Negative decrease = good
    });

    // Penalize cards that hurt the AI
    negativeStats.forEach((stat) => {
      if (effects[stat] > 0) {
        score -= effects[stat] * 3; // 3x penalty
      }
    });

    // Emergency defense: If negative stat is critical (>80)
    negativeStats.forEach((stat) => {
      if (this.stats[stat] > 80 && effects[stat] < 0) {
        score += Math.abs(effects[stat]) * 5; // 5x bonus
      }
    });

    // Finishing move: If positive stat is close to winning (>80)
    positiveStats.forEach((stat) => {
      if (this.stats[stat] > 80 && effects[stat] > 0) {
        score += effects[stat] * 5; // 5x bonus
      }
    });

    return score;
  }
}
