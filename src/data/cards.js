// Card database for Shadows of Judgment
// All cards from GDD with their stat effects

export const lCards = [
  {
    id: "l_data_cross_match",
    name: "Data Cross-Match",
    description: "Analyze patterns in the data",
    effects: {
      evidence: 10,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_logical_trap",
    name: "Logical Trap",
    description: "Set a clever trap for the vigilante",
    effects: {
      evidence: 8,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 4,
    },
  },
  {
    id: "l_press_interview",
    name: "Press Interview",
    description: "Boost team morale",
    effects: {
      evidence: 0,
      morale: -10,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_surveillance_sweep",
    name: "Surveillance Sweep",
    description: "Monitor suspects intensively",
    effects: {
      evidence: 6,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_interrogation",
    name: "Interrogation",
    description: "Question a key witness",
    effects: {
      evidence: 5,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 3,
    },
  },
  {
    id: "l_task_force_rally",
    name: "Task Force Rally",
    description: "Rally the team together",
    effects: {
      evidence: 4,
      morale: -6,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_public_statement",
    name: "Public Statement",
    description: "Reassure the team",
    effects: {
      evidence: 0,
      morale: -8,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_discredit_vigilante",
    name: "Discredit Vigilante",
    description: "Expose flaws in vigilante justice",
    effects: {
      evidence: 3,
      morale: 0,
      justiceInfluence: -8,
      suspicion: 0,
    },
  },
  {
    id: "l_counter_propaganda",
    name: "Counter Propaganda",
    description: "Challenge the vigilante's public support",
    effects: {
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
    effects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: 12,
      suspicion: 0,
    },
  },
  {
    id: "kira_eliminate_witness",
    name: "Eliminate Witness",
    description: "Remove someone who knows too much",
    effects: {
      evidence: -10,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 6,
    },
  },
  {
    id: "kira_media_manipulation",
    name: "Media Manipulation",
    description: "Control the narrative",
    effects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: 0,
      suspicion: -12,
    },
  },
  {
    id: "kira_intimidation",
    name: "Intimidation",
    description: "Threaten those investigating",
    effects: {
      evidence: -6,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "kira_strategic_kill",
    name: "Strategic Kill",
    description: "Make a calculated move",
    effects: {
      evidence: 0,
      morale: 8,
      justiceInfluence: 6,
      suspicion: 0,
    },
  },
  {
    id: "kira_cover_tracks",
    name: "Cover Tracks",
    description: "Hide your involvement",
    effects: {
      evidence: 0,
      morale: 0,
      justiceInfluence: 0,
      suspicion: -8,
    },
  },
  {
    id: "kira_mass_judgment",
    name: "Mass Judgment",
    description: "Execute multiple criminals at once",
    effects: {
      evidence: 0,
      morale: 6,
      justiceInfluence: 10,
      suspicion: 4,
    },
  },
  {
    id: "kira_destroy_evidence",
    name: "Destroy Evidence",
    description: "Eliminate critical proof against you",
    effects: {
      evidence: -12,
      morale: 0,
      justiceInfluence: 0,
      suspicion: 5,
    },
  },
  {
    id: "kira_plant_false_leads",
    name: "Plant False Leads",
    description: "Mislead the investigation",
    effects: {
      evidence: -8,
      morale: 0,
      justiceInfluence: 4,
      suspicion: 0,
    },
  },
];

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
