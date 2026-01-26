import GameLogic from "./GameLogic.js";

/**
 * CardResolver handles the priority-based resolution of card effects
 */
export default class CardResolver {
  /**
   * Determines resolution order and applies effects with delay
   */
  static async resolveCardsWithDelay(
    playerCard,
    aiCard,
    playerStats,
    opponentStats,
    scene,
  ) {
    const { firstCard, secondCard, firstIsPlayer } =
      this.determineResolutionOrder(playerCard, aiCard);

    let updatedPlayerStats = { ...playerStats };
    let updatedOpponentStats = { ...opponentStats };

    // Highlight and apply first card
    if (firstCard) {
      await this.highlightAndApply(
        firstCard,
        firstIsPlayer,
        updatedPlayerStats,
        updatedOpponentStats,
        scene,
        true, // isFirst
      );

      if (firstIsPlayer) {
        updatedPlayerStats = GameLogic.applyEffects(
          updatedPlayerStats,
          firstCard.selfEffects,
        );
        updatedOpponentStats = GameLogic.applyEffects(
          updatedOpponentStats,
          firstCard.opponentEffects,
        );
      } else {
        updatedOpponentStats = GameLogic.applyEffects(
          updatedOpponentStats,
          firstCard.selfEffects,
        );
        updatedPlayerStats = GameLogic.applyEffects(
          updatedPlayerStats,
          firstCard.opponentEffects,
        );
      }

      // Update stats after first card
      scene.playerStats = updatedPlayerStats;
      scene.opponentStats = updatedOpponentStats;
      scene.stats = scene.playerStats;
      scene.updateStatBars();

      // Wait before second card
      await this.wait(800);
    }

    // Apply second card
    if (secondCard) {
      await this.highlightAndApply(
        secondCard,
        !firstIsPlayer,
        updatedPlayerStats,
        updatedOpponentStats,
        scene,
        false, // isFirst
      );

      if (!firstIsPlayer) {
        updatedPlayerStats = GameLogic.applyEffects(
          updatedPlayerStats,
          secondCard.selfEffects,
        );
        updatedOpponentStats = GameLogic.applyEffects(
          updatedOpponentStats,
          secondCard.opponentEffects,
        );
      } else {
        updatedOpponentStats = GameLogic.applyEffects(
          updatedOpponentStats,
          secondCard.selfEffects,
        );
        updatedPlayerStats = GameLogic.applyEffects(
          updatedPlayerStats,
          secondCard.opponentEffects,
        );
      }

      // Update stats after second card
      scene.playerStats = updatedPlayerStats;
      scene.opponentStats = updatedOpponentStats;
      scene.stats = scene.playerStats;
      scene.updateStatBars();
    }

    return {
      playerStats: updatedPlayerStats,
      opponentStats: updatedOpponentStats,
    };
  }

  static determineResolutionOrder(playerCard, aiCard) {
    let firstCard = null;
    let secondCard = null;
    let firstIsPlayer = true;

    if (playerCard && aiCard) {
      const playerSpeed = playerCard.speed || 0;
      const aiSpeed = aiCard.speed || 0;

      if (playerSpeed > aiSpeed) {
        firstCard = playerCard;
        secondCard = aiCard;
        firstIsPlayer = true;
      } else if (aiSpeed > playerSpeed) {
        firstCard = aiCard;
        secondCard = playerCard;
        firstIsPlayer = false;
      } else {
        firstCard = playerCard;
        secondCard = aiCard;
        firstIsPlayer = true;
      }
    } else if (playerCard) {
      firstCard = playerCard;
      firstIsPlayer = true;
    } else if (aiCard) {
      firstCard = aiCard;
      firstIsPlayer = false;
    }

    return { firstCard, secondCard, firstIsPlayer };
  }

  static async highlightAndApply(
    card,
    isPlayer,
    playerStats,
    opponentStats,
    scene,
    isFirst = true,
  ) {
    const cardObjects = isPlayer
      ? scene.revealedPlayerCardObjects
      : scene.revealedOpponentCardObjects;

    // Determine position for text
    const textY = isPlayer ? 700 : 210;

    // Add "RESOLVES FIRST" or "RESOLVES SECOND" text above/below the card
    const resolvingText = scene.add
      .text(375, textY, isFirst ? "RESOLVES FIRST" : "RESOLVES SECOND", {
        fontSize: "28px",
        color: "#ffff00",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(300)
      .setAlpha(0);

    // Fade in text
    scene.tweens.add({
      targets: resolvingText,
      alpha: 1,
      duration: 200,
      ease: "Power2",
    });

    // Add yellow glow (only to objects that support tint)
    cardObjects.forEach((obj) => {
      if (obj.setTint) {
        obj.setTint(0xffff00);
      }
      if (obj.setScale) {
        scene.tweens.add({
          targets: obj,
          scale: 1.15,
          duration: 300,
          yoyo: true,
          repeat: 1,
          ease: "Sine.easeInOut",
        });
      }
    });

    // Wait for highlight animation
    await this.wait(600);

    // Fade out and destroy text
    scene.tweens.add({
      targets: resolvingText,
      alpha: 0,
      duration: 200,
      ease: "Power2",
      onComplete: () => resolvingText.destroy(),
    });

    // Clear tint
    cardObjects.forEach((obj) => {
      if (obj.clearTint) {
        obj.clearTint();
      }
    });
  }

  static wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
