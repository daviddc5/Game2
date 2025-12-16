// Character definitions for Shadows of Judgment

export const characters = {
  "Independent Detective": {
    id: "detective",
    name: "Independent Detective",
    displayName: "Detective",
    portrait: "detective-neutral.png",
    positiveStats: ["evidence"],
    negativeStats: ["morale"],
    winCondition: {
      stat: "evidence",
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
    positiveStats: ["justiceInfluence"],
    negativeStats: ["suspicion"],
    winCondition: {
      stat: "justiceInfluence",
      threshold: 100,
      message: "The vigilante's new world order is complete!",
    },
    loseCondition: {
      stat: "suspicion",
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
