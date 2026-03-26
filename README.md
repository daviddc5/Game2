# ⚖️ Shadows of Judgment

> *A simultaneous turn-based card strategy game of deduction, deception, and prediction.*

🎮 **[Play Now → shadows-of-judgment-517895523663.europe-west1.run.app](https://shadows-of-judgment-517895523663.europe-west1.run.app/)**

---

## 🕹️ What Is This?

**Shadows of Judgment** is a 1v1 card battle game built in **Phaser 3** where both players select their cards **at the same time** — then reveal and resolve them based on speed and priority.

It's less about luck and more about reading your opponent. Can you predict what they'll play and counter it?

---

## ⚡ Core Gameplay

- Both players pick a card **simultaneously** and hit **CONFIRM**
- Cards resolve in **priority order** — faster cards go first
- Manage your **energy** (starts at 1, gains +1 per turn, max 10) to afford bigger plays
- First to hit their **win condition** wins the duel

### 🃏 Card Types

| Type | Priority | Energy | Effect |
|------|----------|--------|--------|
| 🔴 **COUNTER** | 10 (fastest) | 2–3 | Cancels opponent's slow cards |
| 🔵 **QUICK** | 7–9 | 3–4 | Fast but moderate stat gains |
| 🟢 **NORMAL** | 4–6 | 4–5 | Balanced stats and effects |
| 🟡 **POWER** | 1–3 (slowest) | 6–10 | Devastating but easy to counter |

**The Rock-Paper-Scissors dynamic:**
- COUNTER beats POWER
- QUICK beats COUNTER (resolves before it can be cancelled)
- POWER beats QUICK (massive value vs. chip damage)

---

## 👥 Characters

### 🔍 Independent Detective
- **Win:** Reach 100 **Evidence**
- **Lose:** **Morale** drops to 0
- Playstyle: Methodical, evidence-building, disruption

### ⚔️ Vigilante
- **Win:** Reach 100 **Justice Influence**
- **Lose:** **Suspicion** reaches 100
- Playstyle: Aggressive influence, misdirection, public manipulation

---

## 🎮 Game Modes

| Mode | Description |
|------|-------------|
| 🎮 **Single Player** | Duel against the AI |
| 🌐 **Multiplayer** | Real-time 1v1 online via WebSockets |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Game Engine | [Phaser 3](https://phaser.io/) |
| Frontend | JavaScript + Vite |
| Multiplayer | Socket.IO (Node.js server) |
| Hosting | Google Cloud Run |
| Art Style | Pixel art, dark minimal UI |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 20+
- npm

### Install & Run

```bash
# Clone the repo
git clone <repo-url>
cd Game2

# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Start the dev server (frontend)
npm run dev

# In a separate terminal — start the game server
npm run server:dev
```

The game will be available at `http://localhost:5173`

---

## 📦 Deployment

The game is deployed to **Google Cloud Run**. See [DEPLOYMENT.md](DEPLOYMENT.md) for full setup instructions.

```bash
# Deploy to Cloud Run
npm run deploy
```

---

## 📁 Project Structure

```
├── src/
│   ├── scenes/         # Phaser scenes (Title, Menu, Battle, etc.)
│   ├── logic/          # Game logic (CardResolver, GameLogic, AIController)
│   ├── ui/             # UI components (CardHand, StatBarGroup, BattleLog)
│   ├── data/           # Card and character definitions
│   └── network/        # Multiplayer networking (Socket.IO)
├── server/
│   ├── index.js        # Express + Socket.IO server
│   └── socketHandlers.js
├── assets/             # Fonts, portraits, images
└── GDD.md              # Full Game Design Document
```

---

## 📖 Documentation

- [GDD.md](GDD.md) — Full Game Design Document (mechanics, cards, roadmap)
- [DEPLOYMENT.md](DEPLOYMENT.md) — Google Cloud Run deployment guide
- [DESIGN_NOTES/](DESIGN_NOTES/) — Development decisions and notes

---

## 🗺️ Roadmap

- [x] Core simultaneous card system
- [x] Energy management
- [x] AI opponent
- [x] Online multiplayer (WebSockets)
- [ ] More characters (4–6 total)
- [ ] Deck building
- [ ] Sound effects & animations
- [ ] Mobile app (Capacitor)
- [ ] Story mode

---

## 📄 License

ISC
