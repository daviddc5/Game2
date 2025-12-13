// Character definitions for Shadows of Judgment

export const characters = {
  "Detective L": {
    id: "detective_l",
    name: "Detective L",
    displayName: "L",
    portrait: "l-portrait.png", // Asset path for later
    positiveStats: ["evidence"],
    negativeStats: ["morale"],
    winCondition: {
      stat: "evidence",
      threshold: 100,
      message: "L exposes Kira with overwhelming evidence!",
    },
    loseCondition: {
      stat: "morale",
      threshold: 100,
      message: "L's team loses all morale and gives up!",
    },
  },
  Kira: {
    id: "kira",
    name: "Kira",
    displayName: "Kira",
    portrait: "kira-portrait.png", // Asset path for later
    positiveStats: ["justiceInfluence"],
    negativeStats: ["suspicion"],
    winCondition: {
      stat: "justiceInfluence",
      threshold: 100,
      message: "Kira's new world order is complete!",
    },
    loseCondition: {
      stat: "suspicion",
      threshold: 100,
      message: "Kira's identity is exposed!",
    },
  },
};

// Helper function to get character data
export function getCharacter(characterName) {
  return characters[characterName];
}

// Helper to get opponent character
export function getOpponent(characterName) {
  if (characterName === "Detective L") return characters["Kira"];
  if (characterName === "Kira") return characters["Detective L"];
  return null;
}
