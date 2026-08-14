// Character definitions for Shadows of Judgment

export const characters = {
  "Independent Detective": {
    id: "detective",
    name: "Independent Detective",
    displayName: "Detective",
    portrait: "detective-neutral.png",
    statLabels: {
      investigation: "Investigation",
      morale: "Team Morale",
      publicOpinion: "Public Pressure",
      pressure: "Suspicion Level",
    },
    statColors: {
      investigation: { color: 0x00ff00, isGreen: true }, // Green - want high
      morale: { color: 0x00ff00, isGreen: true }, // Green - want high
      publicOpinion: { color: 0xff4444, isGreen: false }, // Red - vigilante support is bad
      pressure: { color: 0xff4444, isGreen: false }, // Red - suspicion on case is bad
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
      investigation: "Evidence Against",
      morale: "Confidence",
      publicOpinion: "Public Support",
      pressure: "Investigation Heat",
    },
    statColors: {
      investigation: { color: 0xff4444, isGreen: false }, // Red - evidence against him is bad
      morale: { color: 0x00ff00, isGreen: true }, // Green - confidence is good
      publicOpinion: { color: 0x00ff00, isGreen: true }, // Green - public support is good
      pressure: { color: 0xff4444, isGreen: false }, // Red - being investigated is bad
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
