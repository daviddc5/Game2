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
      // The Detective's OWN stats. Both characters follow the same rule:
      // win when your green win-stat maxes, lose when pressure maxes.
      // morale and publicOpinion have no win/lose role.
      investigation: { color: 0x00ff00, isGreen: true }, // winCondition - you win at 100
      morale: { color: 0x00ff00, isGreen: true }, // no win/lose role
      publicOpinion: { color: 0xff4444, isGreen: false }, // no win/lose role
      pressure: { color: 0xff4444, isGreen: false }, // loseCondition - you LOSE at 100
    },
    positiveStats: ["investigation"],
    negativeStats: ["pressure"],
    winCondition: {
      stat: "investigation",
      threshold: 100,
      message: "The detective exposes the truth with overwhelming evidence!",
    },
    loseCondition: {
      stat: "pressure",
      threshold: 100,
      message: "Suspicion buries the case — the detective is pulled off it!",
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
      // The Vigilante's OWN stats. Same rule as the Detective:
      // win when your green win-stat maxes, lose when pressure maxes.
      investigation: { color: 0xff4444, isGreen: false }, // no win/lose role
      morale: { color: 0x00ff00, isGreen: true }, // no win/lose role
      publicOpinion: { color: 0x00ff00, isGreen: true }, // winCondition - you win at 100
      pressure: { color: 0xff4444, isGreen: false }, // loseCondition - you LOSE at 100
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
