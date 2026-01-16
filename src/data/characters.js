// Character definitions for Shadows of Judgment

export const characters = {
  "Independent Detective": {
    id: "detective",
    name: "Independent Detective",
    displayName: "Detective",
    portrait: "detective-neutral.png",
    statLabels: {
      evidence: "Investigation",
      morale: "Team Morale",
      justiceInfluence: "Public Pressure",
      suspicion: "Suspicion Level"
    },
    statColors: {
      evidence: { color: 0x00ff00, isGreen: true },        // Green - want high
      morale: { color: 0x00ff00, isGreen: true },          // Green - want high
      justiceInfluence: { color: 0xff4444, isGreen: false }, // Red - vigilante support is bad
      suspicion: { color: 0xff4444, isGreen: false }       // Red - suspicion on case is bad
    },
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
    statLabels: {
      evidence: "Evidence Against",
      morale: "Confidence",
      justiceInfluence: "Public Support",
      suspicion: "Investigation Heat"
    },
    statColors: {
      evidence: { color: 0xff4444, isGreen: false },       // Red - evidence against him is bad
      morale: { color: 0x00ff00, isGreen: true },          // Green - confidence is good
      justiceInfluence: { color: 0x00ff00, isGreen: true }, // Green - public support is good
      suspicion: { color: 0xff4444, isGreen: false }       // Red - being investigated is bad
    },
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
