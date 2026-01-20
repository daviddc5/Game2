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
    const selfEffects = card.selfEffects;
    const opponentEffects = card.opponentEffects;

    // Reward cards that increase AI's positive stats (selfEffects)
    positiveStats.forEach((stat) => {
      score += selfEffects[stat] * 2; // 2x weight
    });

    // Reward cards that decrease AI's negative stats (selfEffects)
    negativeStats.forEach((stat) => {
      score -= selfEffects[stat] * 2; // Negative decrease = good
    });

    // Penalize cards that hurt the AI (selfEffects)
    negativeStats.forEach((stat) => {
      if (selfEffects[stat] > 0) {
        score -= selfEffects[stat] * 3; // 3x penalty
      }
    });

    // Reward cards that hurt opponent's positive stats (opponentEffects)
    positiveStats.forEach((stat) => {
      score -= opponentEffects[stat] * 1.5; // Hurting opponent's resources is good
    });

    // Reward cards that increase opponent's negative stats (opponentEffects)
    negativeStats.forEach((stat) => {
      score += opponentEffects[stat] * 1.5; // Increasing opponent's threats is good
    });

    // Emergency defense: If negative stat is critical (>80)
    negativeStats.forEach((stat) => {
      if (this.stats[stat] > 80 && selfEffects[stat] < 0) {
        score += Math.abs(selfEffects[stat]) * 5; // 5x bonus
      }
    });

    // Finishing move: If positive stat is close to winning (>80)
    positiveStats.forEach((stat) => {
      if (this.stats[stat] > 80 && selfEffects[stat] > 0) {
        score += selfEffects[stat] * 5; // 5x bonus
      }
    });

    return score;
  }

  selectCard(deck, stats, isPlayerTurn, aiEnergy = 999) {
    // Draw 3 cards and pick the best affordable one
    const cards = [];
    for (let i = 0; i < Math.min(3, deck.length); i++) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      cards.push(deck[randomIndex]);
    }

    // Filter to only affordable cards
    const affordableCards = cards.filter((card) => {
      const cost = card.energyCost || 0;
      return cost <= aiEnergy;
    });

    // If no affordable cards, return null
    if (affordableCards.length === 0) {
      return null;
    }

    return this.chooseBestCard(affordableCards);
  }
}
