# 🎮 **GAME DESIGN DOCUMENT (GDD)**

## **Title:** *Shadows of Judgment* (working title)

## **Genre:** Turn-based card strategy (1v1)

## **Inspired by:** Death Note (L vs Kira mind games)

## **Art Style:** Pixel art, dark minimal UI

## **Engine:** Phaser 3

## **Platform:** Web (mobile-first responsive design) → later Mobile App (Capacitor)

## **Design Philosophy:** Mobile-first, works on all devices (375x667 base, scales up)

---

# 1. **High-Level Concept**

A tense, minimalist duel between **L** and **Kira**.

Each side controls **two stats (positive)** and is threatened by **two stats (negative)**.
You and the AI alternate playing cards that affect these stats.
The first character who reaches a critical level in any bar **wins or loses**.

It is intentionally simple so you can finish it.

---

# 2. **Player Roles**

### **Play as L (Detective)**

Goal: expose Kira through evidence.

Stats:

* **Evidence (positive):** reach 100 to win
* **Public Pressure (negative):** reach 100 and L loses

### **Play as Kira (Judge of the New World)**

Goal: gain control while avoiding suspicion.

Stats:

* **Justice Influence (positive):** reach 100 to win
* **Suspicion (negative):** reach 100 and Kira loses

---

# 3. **Stats Overview (The "Mind Grid")**

Each character has:

### **L**

| Bar             | Type     | Win/Loss       |
| --------------- | -------- | -------------- |
| Evidence        | Positive | L wins at 100  |
| Public Pressure | Negative | L loses at 100 |

### **Kira**

| Bar               | Type     | Win/Loss          |
| ----------------- | -------- | ----------------- |
| Justice Influence | Positive | Kira wins at 100  |
| Suspicion         | Negative | Kira loses at 100 |

Each bar ranges **0 → 100**.

---

# 4. **Core Loop (MVP)**

1. **Player chooses character**
2. Both L and Kira sprites and bars appear
3. Player draws 3 cards
4. **Player plays 1 card** → bars change
5. **AI plays 1 card** → bars change
6. Check if any bar hits 100
7. Repeat until win/loss condition is met

That's the entire game loop. No movement, no map, no physics.

---

# 5. **Cards**

Each card has:

* **name**
* **description**
* **icon**
* **stat effects** (usually 1–2 bars)

### **Sample L Cards**

| Name               | Effect                    |
| ------------------ | ------------------------- |
| Data Cross-Match   | +10 Evidence              |
| Logical Trap       | +8 Evidence, +4 Suspicion |
| Press Interview    | -10 Public Pressure       |
| Surveillance Sweep | +6 Evidence               |

### **Sample Kira Cards**

| Name               | Effect                     |
| ------------------ | -------------------------- |
| Righteous Act      | +12 Justice                |
| Eliminate Witness  | -10 Evidence, +6 Suspicion |
| Media Manipulation | -12 Suspicion              |
| Intimidation       | -6 Evidence                |

MVP total: **10–14 cards**.

---

# 6. **AI Design**

### **MVP AI**

* AI chooses a random playable card
* Weighted to pick "helpful" cards more often

### **Improved AI (optional)**

* Chooses best card to:

  * increase its positive stat
  * reduce opponent's positive stat
  * avoid its negative bar reaching 100

Very doable.

---

# 7. **Visual Design**

### **Pixel Art**

* Character portraits: 32×32 or 64×64
* Static for MVP
* No animation required initially

### **UI**

* Bars are simple rectangles
* Cards appear at bottom
* Dark background (abstract "mind grid" or a room silhouette)

### **Tone**

* Calm, eerie, strategic
* Inspired by Death Note's mind-battle scenes

---

# 8. **Screens**

### **Start Screen**

* Choose L or Kira
* Simple pixel portrait

### **Battle Screen** (main screen)

* L portrait (left)
* Kira portrait (right)
* 4 bars in middle
* Hand of 3 cards
* "End Turn" action happens automatically after playing card

### **Win/Lose Screen**

* Character portrait + message
* "Play Again" button

---

# 9. **Technical Stack**

### **Engine:** Phaser 3

### **Language:** JavaScript

### **Art Tools:**

* Piskel (recommended)
* Aseprite (optional)
* AI for generating base pixel art

### **Deployment:**

* Web browser
* Mobile via Capacitor

---

# 10. **MVP Scope**

The FIRST version must contain only:

✔ One duel
✔ Choose L or Kira
✔ Static pixel art portraits
✔ 4 bars
✔ 10–14 cards
✔ Simple AI
✔ Win/loss
✔ Basic UI layout

DO **NOT** include (yet):

✘ animations
✘ deckbuilding
✘ story
✘ sounds
✘ progression
✘ events

Finish the core first.

---

# 11. **Future Add-Ons (Optional)**

* Sprite animations
* Better AI
* Special abilities
* Story missions
* Different backgrounds
* Rare cards
* "Duel of Wits" mechanic (predictions)
* Multiplayer (later)

---

# 12. **Development Roadmap**

## **Phase 1: Project Setup**
- Initialize Phaser 3 project
- Set up basic project structure
- Create placeholder assets

## **Phase 2: Core Systems**
- Implement stat bar system (4 bars)
- Create card data structure
- Build card rendering system

## **Phase 3: Game Logic**
- Implement turn system
- Add card playing mechanics
- Create win/loss condition checks

## **Phase 4: AI Implementation**
- Build basic random AI
- Add weighted decision-making

## **Phase 5: UI & Screens**
- Character selection screen
- Battle screen layout
- Win/Lose screen

## **Phase 6: Art & Polish**
- Create pixel art portraits
- Design card visuals
- Add UI styling

## **Phase 7: Testing & Balance**
- Playtest card balance
- Adjust stat values
- Bug fixes

---

# 13. **Card Database (Complete List)**

## **L's Deck (7 cards)**

| Card Name          | Evidence | Public Pressure | Kira's Justice | Kira's Suspicion | Description                        |
| ------------------ | -------- | --------------- | -------------- | ---------------- | ---------------------------------- |
| Data Cross-Match   | +10      | 0               | 0              | 0                | Analyze patterns in the data       |
| Logical Trap       | +8       | 0               | 0              | +4               | Set a clever trap for Kira         |
| Press Interview    | 0        | -10             | 0              | 0                | Calm public fears through media    |
| Surveillance Sweep | +6       | 0               | 0              | 0                | Monitor suspects intensively       |
| Interrogation      | +5       | 0               | 0              | +3               | Question a key witness             |
| Task Force Rally   | +4       | -6              | 0              | 0                | Boost team morale                  |
| Public Statement   | 0        | -8              | 0              | 0                | Address the public directly        |

## **Kira's Deck (7 cards)**

| Card Name          | Evidence | Public Pressure | Kira's Justice | Kira's Suspicion | Description                        |
| ------------------ | -------- | --------------- | -------------- | ---------------- | ---------------------------------- |
| Righteous Act      | 0        | 0               | +12            | 0                | Execute a major criminal           |
| Eliminate Witness  | -10      | 0               | 0              | +6               | Remove someone who knows too much  |
| Media Manipulation | 0        | 0               | 0              | -12              | Control the narrative              |
| Intimidation       | -6       | 0               | 0              | 0                | Threaten those investigating       |
| Strategic Kill     | 0        | +8              | +6             | 0                | Make a calculated move             |
| Cover Tracks       | 0        | 0               | 0              | -8               | Hide your involvement              |
| Mass Judgment      | 0        | +6              | +10            | +4               | Execute multiple criminals at once |

---

# ⭐ **This is your official, complete GDD**

This document serves as the single source of truth for *Shadows of Judgment*.
All development decisions should reference this document.

---

**Document Version:** 1.0
**Last Updated:** December 12, 2025
**Status:** Ready for Development
