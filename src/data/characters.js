// Character definitions for Shadows of Judgment

export const characters = {
  "Independent Detective": {
    id: "detective",
    name: "Independent Detective",
    displayName: "Detective",
    portrait: "detective-neutral.png",
    statLabels: {
      investigation: "Evidence Chain",
      morale: "Task Force Unity",
      publicOpinion: "Public Panic",
      pressure: "Case Doubt",
    },
    statColors: {
      investigation: { color: 0x00ff00, isGreen: true }, // Green - want high
      morale: { color: 0x00ff00, isGreen: true }, // Green - want high
      publicOpinion: { color: 0xff4444, isGreen: false }, // Red - vigilante support is bad
      pressure: { color: 0xff4444, isGreen: false }, // Red - suspicion on case is bad
    },
    positiveStats: ["investigation", "morale"],
    negativeStats: ["publicOpinion", "pressure"],
    winCondition: {
      stats: ["investigation", "morale"],
      mode: "all",
      threshold: 100,
      message:
        "The detective has sealed the case and the task force is fully united!",
    },
    loseCondition: {
      stats: ["publicOpinion", "pressure"],
      mode: "any",
      threshold: 100,
      message: "The case collapses under panic and doubt!",
    },
  },
  Vigilante: {
    id: "vigilante",
    name: "Vigilante",
    displayName: "Vigilante",
    portrait: "killer-neutral.png",
    statLabels: {
      investigation: "Evidence Against",
      morale: "Cult Resolve",
      publicOpinion: "Public Support",
      pressure: "Manhunt Heat",
    },
    statColors: {
      investigation: { color: 0xff4444, isGreen: false }, // Red - evidence against him is bad
      morale: { color: 0x00ff00, isGreen: true }, // Green - confidence is good
      publicOpinion: { color: 0x00ff00, isGreen: true }, // Green - public support is good
      pressure: { color: 0xff4444, isGreen: false }, // Red - being investigated is bad
    },
    positiveStats: ["morale", "publicOpinion"],
    negativeStats: ["investigation", "pressure"],
    winCondition: {
      stats: ["morale", "publicOpinion"],
      mode: "all",
      threshold: 100,
      message:
        "The vigilante's followers are unified and fully behind the cause!",
    },
    loseCondition: {
      stats: ["investigation", "pressure"],
      mode: "any",
      threshold: 100,
      message: "The vigilante is cornered by evidence and manhunt pressure!",
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
