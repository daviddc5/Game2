// Card database for Shadows of Judgment
// All cards from GDD with their stat effects

export const lCards = [
  {
    id: "l_data_cross_match",
    name: "Data Cross-Match",
    description: "Analyze patterns in the data",
    effects: {
      evidence: 10,
      publicPressure: 0,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_logical_trap",
    name: "Logical Trap",
    description: "Set a clever trap for Kira",
    effects: {
      evidence: 8,
      publicPressure: 0,
      justiceInfluence: 0,
      suspicion: 4,
    },
  },
  {
    id: "l_press_interview",
    name: "Press Interview",
    description: "Calm public fears through media",
    effects: {
      evidence: 0,
      publicPressure: -10,
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
      publicPressure: 0,
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
      publicPressure: 0,
      justiceInfluence: 0,
      suspicion: 3,
    },
  },
  {
    id: "l_task_force_rally",
    name: "Task Force Rally",
    description: "Boost team morale",
    effects: {
      evidence: 4,
      publicPressure: -6,
      justiceInfluence: 0,
      suspicion: 0,
    },
  },
  {
    id: "l_public_statement",
    name: "Public Statement",
    description: "Address the public directly",
    effects: {
      evidence: 0,
      publicPressure: -8,
      justiceInfluence: 0,
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
      publicPressure: 0,
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
      publicPressure: 0,
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
      publicPressure: 0,
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
      publicPressure: 0,
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
      publicPressure: 8,
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
      publicPressure: 0,
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
      publicPressure: 6,
      justiceInfluence: 10,
      suspicion: 4,
    },
  },
];

// Helper function to get the correct deck for a character
export function getDeckForCharacter(character) {
  if (character === "Detective L") {
    return lCards;
  } else if (character === "Kira") {
    return kiraCards;
  }
  return [];
}

// Helper function to draw random cards from a deck
export function drawCards(deck, count = 3) {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
