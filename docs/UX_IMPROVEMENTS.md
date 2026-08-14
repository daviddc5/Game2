# UX & Engagement Improvements

## Context

LinkedIn feedback: the game concept is cool but it's **hard to understand and hard to engage with**. This document captures the diagnosis and planned improvements.

---

## Diagnosis

### 1. Too many stats to track (8 total)
Each character has 4 stats, some "good" and some "bad," working differently per character. Most successful card games have 1-2 stats (health, mana).

### 2. Win/lose conditions are confusing
"Get your green stat to 100 but don't let your red stat hit 100" - and the opponent's conditions are *different*. Players must learn two rule sets.

### 3. No learning-by-doing
The 5-page tutorial is a wall of text. Players must read and memorize rules before they can play. Successful games teach through guided first turns.

### 4. Card effects are opaque
Cards modify 4 stats simultaneously with different values. A card might do `+15 Investigation, -8 Public Pressure, +10 opponent Suspicion`. That's hard to evaluate at a glance.

### 5. No visual storytelling (HIGHEST PRIORITY)
The theme (detective vs vigilante) is cool but conveyed only through stat names and card text. There's no narrative arc or visual feedback that makes the theme *felt*.

### 6. Energy + speed + type system is a lot at once
Players need to understand energy costs, speed/priority, card types, AND stat effects all before their first turn.

---

## Planned Improvements

### Priority 1: Visual Storytelling & Narrative Feedback

#### 1A. Turn-by-Turn Narration
- Replace generic battle log with narrative text that tells a story
- Each card play triggers a dramatic description of what happened
- Examples:
  - Detective plays "Surveillance Sweep": *"The Detective deploys surveillance cameras across the city, watching the shadows for the Vigilante's next move."*
  - Vigilante plays "Righteous Act": *"The Vigilante strikes down a notorious crime lord. The public cheers - but the Detective takes note."*
  - Counter cancels: *"The Detective anticipated this move! The Vigilante's plan crumbles before it even begins."*

#### 1B. Narrative Event System
- Key moments trigger story beats:
  - Win stat crosses 50: *"The tide is turning! The Detective's investigation is gaining momentum."*
  - Lose stat crosses 75: *"Danger! The Vigilante's identity is nearly exposed!"*
  - Near win (90+): *"The endgame approaches. One more push could decide everything."*
  - Counter play: dramatic counter-narration
  - Big power card: special dramatic text

#### 1C. Screen Effects During Card Resolution
- Screen shake on power cards
- Color flash on counters (red flash for cancellation)
- Glow/pulse effects on stat bars when they change significantly
- Camera zoom on dramatic moments
- Particle-like effects (using Phaser rectangles/circles) for big plays

#### 1D. Card Flavor Text
- Add `playNarration` field to every card in `cards.js`
- Each card gets a unique narrative description of what happens when played
- Shown in the narration overlay during resolution

### Priority 2: Reducing Confusion

#### 2A. Momentum / Tug-of-War Bar
- A single horizontal bar at the center of the battle screen
- Shows who is winning at a glance without needing to understand individual stats
- Left side = player winning (blue), right side = opponent winning (red)
- Calculation: `(playerWinProgress - playerLoseRisk) - (opponentWinProgress - opponentLoseRisk)`
- Updates with smooth animation each turn
- Labels: player name on left, opponent name on right, "ADVANTAGE" indicator

#### 2B. Simplified Card Effect Display
- Replace raw stat numbers on cards with intuitive visual summary
- Show colored arrows: green up-arrows for beneficial effects, red down-arrows for harmful
- Compact format on card face: "YOU: +++" / "FOE: --" (arrow count = impact strength)
- Full stat breakdown only shown in the enlarged card view (tap to see details)
- Card "power rating" indicator (1-5 stars or simple strength label)

#### 2C. Better Battle Log (Story-Driven)
- Transform the existing `BattleLog` from plain text into a narrative story log
- Each entry is a short story sentence, not "Player played: Card Name"
- Color-coded by impact: green for good news, red for threats, gold for dramatic moments
- Show turn number context

#### 2D. Interactive Tutorial (Guided First Game)
- New "LEARN TO PLAY" button on the main menu
- Launches a special tutorial battle with step-by-step guidance
- Tutorial flow (one concept per turn):
  1. **Turn 1**: "This is your hand. Tap a card to select it." (highlight cards, dim everything else)
  2. **Turn 2**: "See the energy cost? You need enough energy to play." (highlight energy display)
  3. **Turn 3**: "Watch the momentum bar - it shows who's winning." (highlight momentum bar)
  4. **Turn 4**: "Your green stats are good. Push them up!" (highlight player stats)
  5. **Turn 5**: "The opponent's red stats hurt them. Push those up too!" (highlight opponent stats)
  6. **Turn 6**: "Counter cards cancel the opponent's move! Try it." (give counter card)
  7. Free play for remaining turns with occasional tips
- AI plays slowly and predictably during tutorial
- Tutorial can be skipped at any time

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/data/narration.js` | Narrative text for all cards + game event narration |
| `src/ui/MomentumBar.js` | Tug-of-war progress indicator |
| `src/ui/NarrativeOverlay.js` | Dramatic text overlay during card resolution |
| `src/scenes/TutorialBattleScene.js` | Interactive tutorial scene |

## Files to Modify

| File | Changes |
|------|---------|
| `src/data/cards.js` | Add `playNarration` to each card |
| `src/ui/CardHand.js` | Simplified effect display (arrows instead of numbers) |
| `src/ui/BattleLog.js` | Transform into narrative story log |
| `src/logic/CardResolver.js` | Integrate narration generation + screen effects |
| `src/scenes/BattleScene.js` | Add momentum bar, narrative overlay, screen effects, tutorial hooks |
| `src/scenes/MenuScene.js` | Add "LEARN TO PLAY" tutorial button |

---

## Implementation Order

1. Add `playNarration` to all cards in `cards.js`
2. Create `narration.js` (narrative generation logic)
3. Create `NarrativeOverlay.js` (dramatic text display)
4. Create `MomentumBar.js` (tug-of-war bar)
5. Modify `CardResolver.js` (narration + screen effects)
6. Modify `BattleLog.js` (story-driven log)
7. Modify `CardHand.js` (simplified card display)
8. Modify `BattleScene.js` (integrate all new systems)
9. Create `TutorialBattleScene.js` (interactive tutorial)
10. Modify `MenuScene.js` (add tutorial button)
11. Update `main.js` config to register new scene

---

## Success Criteria

- A new player can understand who's winning within 5 seconds of looking at the screen (momentum bar)
- Card plays feel dramatic and tell a story (narration overlay + screen effects)
- A player can learn the game by playing the tutorial without reading any text walls
- Cards are easy to evaluate at a glance (simplified display with arrows)
- The detective vs vigilante theme is *felt*, not just read
