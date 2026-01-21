// Card database for Shadows of Judgment
// All cards from GDD with their stat effects

export const lCards = [
  {
    id: "l_defensive_stance",
    name: "Defensive Stance",
    description: "Brace for the vigilante's attack",
    energyCost: 2,
    selfEffects: {
      investigation: 0,
      morale: 3,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "l_data_cross_match",
    name: "Data Cross-Match",
    description: "Analyze patterns in the data",
    energyCost: 6,
    selfEffects: {
      investigation: 10, // Boost your investigation
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 6, // Gather evidence against them
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "l_logical_trap",
    name: "Logical Trap",
    description: "Set a clever trap for the vigilante",
    energyCost: 5,
    selfEffects: {
      investigation: 8,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: -5, // Shake their confidence
      publicOpinion: 0,
      pressure: 5, // Increase heat on them
    },
  },
  {
    id: "l_press_interview",
    name: "Press Interview",
    description: "Boost team morale publicly",
    energyCost: 5,
    selfEffects: {
      investigation: 0,
      morale: 12, // Boost your team morale
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: -8, // Reduce vigilante public support
      pressure: 0,
    },
  },
  {
    id: "l_surveillance_sweep",
    name: "Surveillance Sweep",
    description: "Monitor suspects intensively",
    energyCost: 5,
    selfEffects: {
      investigation: 8,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 4,
      morale: 0,
      publicOpinion: 0,
      pressure: 5,
    },
  },
  {
    id: "l_interrogation",
    name: "Interrogation",
    description: "Question a key witness",
    energyCost: 4,
    selfEffects: {
      investigation: 6,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 3,
      morale: 0,
      publicOpinion: 0,
      pressure: 4,
    },
  },
  {
    id: "l_logical_trap",
    name: "Task Force Rally",
    description: "Rally the team together",
    energyCost: 4,
    selfEffects: {
      investigation: 4,
      morale: 9,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: -4,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "l_public_statement",
    name: "Public Statement",
    description: "Reassure the team and public",
    energyCost: 4,
    selfEffects: {
      investigation: 0,
      morale: 10,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: -7,
      pressure: 0,
    },
  },
  {
    id: "l_discredit_vigilante",
    name: "Discredit Vigilante",
    description: "Expose flaws in vigilante justice",
    energyCost: 6,
    selfEffects: {
      investigation: 5,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: -10,
      pressure: 0,
    },
  },
  {
    id: "l_counter_propaganda",
    name: "Counter Propaganda",
    description: "Challenge the vigilante's public support",
    energyCost: 3,
    selfEffects: {
      investigation: 2,
      morale: 2,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: -5,
      pressure: 0,
    },
  },
];

export const kiraCards = [
  {
    id: "kira_lay_low",
    name: "Lay Low",
    description: "Hide and avoid detection",
    energyCost: 2,
    selfEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: 0,
      pressure: -4,
    },
    opponentEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "kira_intimidation",
    name: "Intimidation",
    description: "Threaten those investigating",
    energyCost: 3,
    selfEffects: {
      investigation: -4,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
    opponentEffects: {
      investigation: -3,
      morale: -4,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "kira_strategic_kill",
    name: "Strategic Kill",
    description: "Make a calculated move",
    energyCost: 4,
    selfEffects: {
      investigation: 0,
      morale: 10,
      publicOpinion: 8,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: 5,
      pressure: 0,
    },
  },
  {
    id: "kira_cover_tracks",
    name: "Cover Tracks",
    description: "Hide your involvement",
    energyCost: 4,
    selfEffects: {
      investigation: -7,
      morale: 0,
      publicOpinion: 0,
      pressure: -9,
    },
    opponentEffects: {
      investigation: -5,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "kira_plant_false_leads",
    name: "Plant False Leads",
    description: "Mislead the investigation",
    energyCost: 5,
    selfEffects: {
      investigation: -10,
      morale: 0,
      publicOpinion: 6,
      pressure: 0,
    },
    opponentEffects: {
      investigation: -6,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "kira_righteous_act",
    name: "Righteous Act",
    description: "Execute a major criminal",
    energyCost: 6,
    selfEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: 14,
      pressure: 0,
    },
    opponentEffects: {
      investigation: 0,
      morale: -6,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "kira_media_manipulation",
    name: "Media Manipulation",
    description: "Control the narrative",
    energyCost: 6,
    selfEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: 10,
      pressure: -10,
    },
    opponentEffects: {
      investigation: 0,
      morale: 0,
      publicOpinion: 6,
      pressure: 0,
    },
  },
  {
    id: "kira_eliminate_witness",
    name: "Eliminate Witness",
    description: "Remove someone who knows too much",
    energyCost: 7,
    selfEffects: {
      investigation: -10,
      morale: 0,
      publicOpinion: 0,
      pressure: -8,
    },
    opponentEffects: {
      investigation: -6,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
  },
  {
    id: "kira_mass_judgment",
    name: "Mass Judgment",
    description: "Execute multiple criminals at once",
    energyCost: 7,
    selfEffects: {
      investigation: 0,
      morale: 8,
      publicOpinion: 12,
      pressure: 5,
    },
    opponentEffects: {
      investigation: 0,
      morale: -7,
      publicOpinion: 6,
      pressure: 0,
    },
  },
  {
    id: "kira_destroy_evidence",
    name: "Destroy Evidence",
    description: "Eliminate critical proof against you",
    energyCost: 8,
    selfEffects: {
      investigation: -14,
      morale: 0,
      publicOpinion: 0,
      pressure: 6,
    },
    opponentEffects: {
      investigation: -10,
      morale: 0,
      publicOpinion: 0,
      pressure: 0,
    },
  },
];

// Helper function to get energy cost color
export function getEnergyCostColor(cost) {
  if (cost <= 3) return "#00ff00"; // Green - Counter
  if (cost <= 4) return "#00ccff"; // Cyan - Quick
  if (cost <= 5) return "#ffff00"; // Yellow - Normal
  if (cost <= 7) return "#ff9900"; // Orange - Power
  return "#ff0000"; // Red - Ultimate
}

// Helper function to get the correct deck for a character
export function getDeckForCharacter(character) {
  if (character === "Independent Detective") {
    return lCards;
  } else if (character === "Vigilante") {
    return kiraCards;
  }
  return [];
}

// Helper function to draw random cards from a deck
export function drawCards(deck, count = 3) {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
