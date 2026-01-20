// Card database for Shadows of Judgment
// All cards from GDD with their stat effects

export const lCards = [
  {
    id: "l_data_cross_match",
    name: "Data Cross-Match",
    description: "Analyze patterns in the data",
    energyCost: 6,
    selfEffects: {
      evidence: 8, // Boost your investigation
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 5, // Gather evidence against them
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_logical_trap",
    name: "Logical Trap",
    description: "Set a clever trap for the vigilante",
    energyCost: 5,
    selfEffects: {
      evidence: 6,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 0,
      morale: -4, // Shake their confidence
      justiceInfluence: 0,
      suspicion: 4, // Increase heat on them
    },
  },
  {
    id: "l_press_interview",
    name: "Press Interview",
    description: "Boost team morale publicly",
    energyCost: 5,
    selfEffects: {
      evidence: 0,
      morale: 10, // Boost your team morale
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: -5, // Reduce vigilante public support
      suspicion: 0,
    },
  },
  {
    id: "l_surveillance_sweep",
    name: "Surveillance Sweep",
    description: "Monitor suspects intensively",
    energyCost: 5,
    selfEffects: {
      evidence: 6,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 3,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 3, // Put pressure on them
    },
  },
  {
    id: "l_interrogation",
    name: "Interrogation",
    description: "Question a key witness",
    energyCost: 4,
    selfEffects: {
      evidence: 5,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 2,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 3,
    },
  },
  {
    id: "l_task_force_rally",
    name: "Task Force Rally",
    description: "Rally the team together",
    energyCost: 4,
    selfEffects: {
      evidence: 3,
      morale: 8,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 0,
      morale: -3,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_public_statement",
    name: "Public Statement",
    description: "Reassure the team and public",
    energyCost: 4,
    selfEffects: {
      evidence: 0,
      morale: 8,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: -6,
      suspicion: 0,
    },
  },
  {
    id: "l_discredit_vigilante",
    name: "Discredit Vigilante",
    description: "Expose flaws in vigilante justice",
    energyCost: 6,
    selfEffects: {
      evidence: 3,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: -8, // Reduce their public support
      suspicion: 0,
    },
  },
  {
    id: "l_counter_propaganda",
    name: "Counter Propaganda",
    description: "Challenge the vigilante's public support",
    energyCost: 3,
    selfEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: -10,
      suspicion: 0,
    },
  },
];

export const kiraCards = [
  {
    id: "kira_righteous_act",
    name: "Righteous Act",
    description: "Execute a major criminal",
    energyCost: 7,
    selfEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: 12, // Boost your public support
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 0,
      morale: -5, // Demoralize detective team
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "kira_eliminate_witness",
    name: "Eliminate Witness",
    description: "Remove someone who knows too much",
    energyCost: 8,
    selfEffects: {
      evidence: -8, // Reduce evidence against you
      morale: 0,
      justiceInfluence: 0,
      suspicion: -6, // Reduce investigation heat
    },
    opponentEffects: {
      evidence: -5, // Destroy their evidence
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "kira_media_manipulation",
    name: "Media Manipulation",
    description: "Control the narrative",
    energyCost: 7,
    selfEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: 8, // Boost public support
      suspicion: -10, // Reduce investigation heat
    },
    opponentEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: 5, // Public pressure increases
      suspicion: 0,
    },
  },
  {
    id: "kira_intimidation",
    name: "Intimidation",
    description: "Threaten those investigating",
    energyCost: 4,
    selfEffects: {
      evidence: -6,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: -3,
      morale: -4, // Scare the team
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "kira_strategic_kill",
    name: "Strategic Kill",
    description: "Make a calculated move",
    energyCost: 5,
    selfEffects: {
      evidence: 0,
      morale: 8, // Boost confidence
      justiceInfluence: 6, // Gain public support
      suspicion: 0,
    },
    opponentEffects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: 3, // Public pressure increases
      suspicion: 0,
    },
  },
  {
    id: "kira_cover_tracks",
    name: "Cover Tracks",
    description: "Hide your involvement",
    energyCost: 5,
    selfEffects: {
      evidence: -5,
      morale: 0,
      justiceInfluence: 0,
      suspicion: -8,
    },
    opponentEffects: {
      evidence: -3,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "kira_mass_judgment",
    name: "Mass Judgment",
    description: "Execute multiple criminals at once",
    energyCost: 8,
    selfEffects: {
      evidence: 0,
      morale: 6,
      justiceInfluence: 10,
      suspicion: 4,
    },
    opponentEffects: {
      evidence: 0,
      morale: -6,
      justiceInfluence: 5,
      suspicion: 0,
    },
  },
  {
    id: "kira_destroy_evidence",
    name: "Destroy Evidence",
    description: "Eliminate critical proof against you",
    energyCost: 9,
    selfEffects: {
      evidence: -12,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 5,
    },
    opponentEffects: {
      evidence: -8,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "kira_plant_false_leads",
    name: "Plant False Leads",
    description: "Mislead the investigation",
    energyCost: 6,
    selfEffects: {
      evidence: -8,
      morale: 0,
      justiceInfluence: 4,
      suspicion: 0,
    },
    opponentEffects: {
      evidence: -5,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
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
