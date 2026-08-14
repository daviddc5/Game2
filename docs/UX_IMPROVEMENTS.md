# UX & Engagement Improvements

## Context

LinkedIn feedback: the game concept is cool but it's **hard to understand and hard to engage with**. This document captures the diagnosis and planned improvements.

---

## Diagnosis

### 1. Not 8 stats — 4 shared stats wearing 8 different names
There are only four underlying values in `GameLogic`: `investigation`, `morale`, `publicOpinion`, `pressure`. Each character relabels all four. The *same* bar reads "Team Morale" to the Detective and "Confidence" to the Vigilante.

This is worse than eight independent stats, because the player must hold two meanings for one number. Most successful card games have 1-2 stats (health, mana).

### 2. Win/lose conditions are confusing
"Get your green stat to 100 but don't let your red stat hit 100" - and the opponent's conditions are *different*. Players must learn two rule sets.

### 2b. 🔴 The colours actively lie to the Detective
In `characters.js`, the Detective's `morale` stat is:
- labelled **"Team Morale"** — sounds like it belongs to the player
- coloured **green**, `isGreen: true`, commented *"want high"*
- listed in **`negativeStats`** — contradicting the line above it
- the Detective's **`loseCondition` at `>= 100`**

So a new Detective player sees a green bar called "Team Morale", correctly infers that green means push it up, pushes it up, and **loses the game**. `statColors.isGreen` feeds `isPositive` straight into the stat bars at `BattleScene.js:238-239`, so this renders exactly as described.

No amount of narration or tutorial fixes a UI that tells players to do the thing that kills them. **Fix this before anything else in this document.**

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

### Priority 0: Correctness & Visual Redesign (do first)

#### 0A. Fix the contradictory stat signals
- Make `statColors.isGreen` agree with `positiveStats` / `negativeStats` for every stat on both characters. Right now the Detective's `morale` disagrees with itself.
- Reconcile `GameLogic.checkWinConditions()` with the `winCondition` / `loseCondition` objects in `characters.js`. The logic currently hardcodes thresholds and returns the names `"Detective L"` and `"Kira"`, ignoring the character definitions entirely.
- Relabel the four stats so each name says **whose** it is. "Team Morale" reads as the player's; it is really the Vigilante's confidence. Names like "Their Confidence" / "Your Evidence" remove the ambiguity for free.

#### 0B. Visual redesign pass before building new UI
Every Priority 1 and 2 item needs somewhere to live: the narration overlay needs screen space, the momentum bar needs a home, simplified cards change the hand's footprint. Building those into the current layout and *then* redesigning means building each one twice.

Design the target battle screen first, then build into it:
- One agreed layout for the battle screen at 750x1334, with the momentum bar, narration overlay, and compact stat display placed deliberately rather than fitted around what already exists.
- A named colour palette and type scale, so "green means good" is a rule applied once rather than a per-stat decision.
- A minimum type size. Several current labels are 10-14px in a 750-wide canvas that renders at roughly half scale on a phone — around 5-7pt on screen. Nothing below ~24px in design space survives on a real device.
- Decide the art direction explicitly: the pixel-art portraits and the flat rectangle UI currently belong to two different games.

*Claude can generate layout mockups and palette options for this step before any code changes.*

---

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

### Priority 3: Game Feel

The current diagnosis is entirely about *comprehension*. "Loses engagement" is a separate failure: a player can understand the game perfectly and still be bored. These are the cheapest fixes per unit of engagement.

#### 3A. Sound — there is none at all
`grep` finds zero audio in the codebase. No card sound, no hit, no music. Silence reads as "unfinished prototype" faster than any visual problem, and this is the highest impact-per-hour item in the document.
- Card select, card confirm, card reveal
- Distinct counter/cancel sting — the most dramatic moment in the game currently passes in silence
- Stat gain vs stat loss tones
- Win and lose stings
- One ambient loop, with a mute toggle

#### 3B. Juice — uneven, and worst where it matters on mobile
There are 16 tweens across the UI, and they are not spread evenly.

Already good, leave alone:
- Card resolution: flip reveal, counter/cancel X, priority text, glow layers (6 tweens)
- Stat bars: animated fill plus floating `+12` / `-8` numbers with correct colour inversion for negative stats — `StatBarGroup.showStatChange()`, called on every update

Missing entirely:
- **Buttons have no press state.** They swap `setBackgroundColor` on hover and nothing else. See `MenuScene.js:56-62`.
- `BattleLog` — 0 tweens, entries appear instantly
- `StatsModal` — 0 tweens, pops in with no transition

**The real problem: roughly 9 of the 16 tweens are hover-driven** — the card lift in `CardHand`, the border flash, every button colour swap. `pointerover` does not meaningfully exist on touch, so **on a phone most of this feedback never plays at all.** Tapping a button produces no visual response until the scene changes, which reads as an unresponsive control and causes double-taps.

Fix in this order:
1. Button press states — scale down ~0.95 on `pointerdown`, spring back on release. Works on both input types.
2. Card tap feedback that does not depend on hover — shares a root cause with the touch interaction redesign
3. Stat bar overshoot and settle
4. Portrait reaction on big swings

#### 3C. Turn pacing
`BattleScene.js` has stacked `delayedCall`s of 800ms, 1000ms, 1000ms, 500ms, 800ms and a 2000ms hold. Add those up across a turn and the player spends several seconds per turn watching nothing happen.
- Time one full turn end to end and write the number down before changing anything.
- Overlap animations instead of queueing them.
- Let a tap skip any resolution animation. Returning players should never be forced to sit through a sequence they have seen fifty times.

#### 3D. The first thirty seconds
Before the tutorial can teach anything, the player has to still be there.
- Count taps from load to first card played. Every one before the first meaningful decision is a place to lose someone.
- The title screen should state what the game *is* in one line, not just offer buttons.
- Consider dropping the player straight into a match against the AI, with character select offered afterwards.

#### 3E. Win/lose payoff
The match ends and a screen appears. Ending is the moment that decides whether a player starts a second match:
- Show the final momentum swing, not just the result
- One line on *why* they won or lost, tied to the stat that ended it
- "Play again" as the default focused action, on the same character, with no re-selection

---

### Priority 4: Reasons to Return (later)

Not for this pass, but worth recording since engagement was the complaint:
- Persist a local record: matches played, win rate per character, longest streak
- Per-character win/loss tracking gives a reason to try the other side
- Daily "beat the AI on hard" style challenge

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/data/narration.js` | Narrative text for all cards + game event narration |
| `src/ui/MomentumBar.js` | Tug-of-war progress indicator |
| `src/ui/NarrativeOverlay.js` | Dramatic text overlay during card resolution |
| `src/scenes/TutorialBattleScene.js` | Interactive tutorial scene |
| `src/audio/SoundManager.js` | Central sound playback + mute toggle |

## Files to Modify

| File | Changes |
|------|---------|
| `src/data/cards.js` | Add `playNarration` to each card |
| `src/ui/CardHand.js` | Simplified effect display (arrows instead of numbers) |
| `src/ui/BattleLog.js` | Transform into narrative story log; add entry transitions |
| `src/ui/StatBarGroup.js` | Add overshoot/settle (floating numbers already implemented) |
| `src/logic/CardResolver.js` | Integrate narration generation + screen effects |
| `src/scenes/BattleScene.js` | Add momentum bar, narrative overlay, screen effects, tutorial hooks |
| `src/scenes/MenuScene.js` | Add "LEARN TO PLAY" tutorial button |
| `src/data/characters.js` | Fix contradictory `isGreen` values; relabel stats to say whose they are |
| `src/logic/GameLogic.js` | Read win/lose conditions from `characters.js` instead of hardcoding |
| `src/scenes/GameOverScene.js` | Show the deciding stat and why; default to "play again" |
| `src/scenes/BootScene.js` | Preload audio |

---

## Implementation Order

**Phase 0 — correctness and design (before any new UI)**
1. Fix `isGreen` contradictions and relabel stats in `characters.js`
2. Reconcile `GameLogic.checkWinConditions()` with the character definitions
3. Agree the redesigned battle screen layout, palette, and type scale

**Phase 1 — game feel (cheapest engagement wins)**
4. `SoundManager.js` + preload; card, counter, win/lose sounds
5. Button press states (works on touch, unlike the current hover-only feedback)
6. Audit turn timing; overlap animations; add tap-to-skip

**Phase 2 — comprehension**
7. `MomentumBar.js` — who is winning, at a glance
8. Simplified card effect display in `CardHand.js`
9. `GameOverScene.js` payoff pass

**Phase 3 — storytelling**
10. Add `playNarration` to all cards in `cards.js`
11. `narration.js` generation logic
12. `NarrativeOverlay.js` + screen effects in `CardResolver.js`
13. `BattleLog.js` into a story log

**Phase 4 — teaching**
14. `TutorialBattleScene.js`
15. "LEARN TO PLAY" button in `MenuScene.js`, register scene in config

Sound and juice move ahead of narration deliberately: they are far less work, they benefit every future change, and they address "loses engagement" directly rather than through comprehension.

## Success Criteria

- A new player can understand who's winning within 5 seconds of looking at the screen (momentum bar)
- Card plays feel dramatic and tell a story (narration overlay + screen effects)
- A player can learn the game by playing the tutorial without reading any text walls
- Cards are easy to evaluate at a glance (simplified display with arrows)
- The detective vs vigilante theme is *felt*, not just read

## How to Test It

The criteria above are unfalsifiable as written. Make them measurable with five people who have never played:

1. Show a mid-match screenshot. Ask "who is winning?" — target 4 of 5 correct within 5 seconds.
2. Hand over the tutorial with no explanation. Ask them to teach the rules back afterwards.
3. Watch where they stop. The turn number where attention drops is the pacing problem, and it is the one number worth tracking across builds.
4. Ask one question at the end: "would you play again?" That is the actual metric the LinkedIn feedback was about.

Record the answers before the changes as a baseline. Without it there is no way to know whether any of this worked.
