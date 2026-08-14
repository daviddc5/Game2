// Character definitions for Shadows of Judgment

export const characters = {
  "Independent Detective": {
    id: "detective",
    name: "Independent Detective",
    displayName: "Detective",
    portrait: "detective-neutral.png",
    // Labels say WHOSE stat it is. All four values are shared between the two
    // characters; only the label and colour differ. "Team Morale" used to read
    // as the player's own when it is really the Vigilante's confidence.
    statLabels: {
      investigation: "Your Evidence",
      morale: "Their Confidence",
      publicOpinion: "Their Support",
      pressure: "Heat On Them",
    },
    statColors: {
      investigation: { color: 0x00ff00, isGreen: true }, // Green - you win at 100
      morale: { color: 0xff4444, isGreen: false }, // Red - you LOSE at 100
      publicOpinion: { color: 0xff4444, isGreen: false }, // Red - they win at 100
      pressure: { color: 0x00ff00, isGreen: true }, // Green - they lose at 100, so you win
    },
    positiveStats: ["investigation"],
    negativeStats: ["morale"],
    winCondition: {
      stat: "investigation",
      threshold: 100,
      message: "The detective exposes the truth with overwhelming evidence!",
    },
    loseCondition: {
      stat: "morale",
      threshold: 100,
      message: "The detective's team loses all morale and gives up!",
    },
  },
  Vigilante: {
    id: "vigilante",
    name: "Vigilante",
    displayName: "Vigilante",
    portrait: "killer-neutral.png",
    statLabels: {
      investigation: "Evidence On You",
      morale: "Your Confidence",
      publicOpinion: "Your Support",
      pressure: "Heat On You",
    },
    statColors: {
      investigation: { color: 0xff4444, isGreen: false }, // Red - they win at 100
      morale: { color: 0x00ff00, isGreen: true }, // Green - they lose at 100, so you win
      publicOpinion: { color: 0x00ff00, isGreen: true }, // Green - you win at 100
      pressure: { color: 0xff4444, isGreen: false }, // Red - you LOSE at 100
    },
    positiveStats: ["publicOpinion"],
    negativeStats: ["pressure"],
    winCondition: {
      stat: "publicOpinion",
      threshold: 100,
      message: "The vigilante's new world order is complete!",
    },
    loseCondition: {
      stat: "pressure",
      threshold: 100,
      message: "The vigilante's identity is exposed!",
    },
  },
};

// Helper function to get character data
export function getCharacter(characterName) {
  return characters[characterName];
}

// Helper to get opponent character
export function getOpponent(characterName) {
  if (characterName === "Independent Detective") return characters["Vigilante"];
  if (characterName === "Vigilante") return characters["Independent Detective"];
  return null;
}
