repo: daviddc5/game--shadows-of-judgement
branch: main

## Last sync
date: 2026-08-14T13:52:00Z

### Updated in this project
- Read the engine: stat model, win/lose conditions, card data, resolution order, HUD components.
- Copied the six pixel portraits (detective + killer, neutral/winning/losing) into `assets/images/`.
- Built the redesign proposal + interactive battle prototype using real card data and real stat labels.
- Flagged an IP/licensing risk: bundled `Death Note.ttf`, `lCards`/`kiraCards` naming, "L or Kira" in the GDD.

## Screen map
| Project screen | Built from |
| --- | --- |
| Title | src/scenes/TitleScene.js, src/scenes/MenuScene.js |
| Mode select | src/scenes/MenuScene.js, src/scenes/MultiplayerLobbyScene.js, src/scenes/SinglePlayerLobbyScene.js |
| Character select | src/data/characters.js (statLabels, winCondition, loseCondition) |
| Battle HUD | src/scenes/BattleScene.js, src/ui/StatBarGroup.js, src/ui/CardHand.js, src/ui/BattleLog.js, src/logic/GameLogic.js, src/logic/CardResolver.js |
| Card inspect | src/data/cards.js, src/ui/CardHand.js |
| Game over | src/scenes/GameOverScene.js, src/logic/GameLogic.js |
| Test mode | src/scenes/MenuScene.js (debugMode registry flag), src/ui/StatsModal.js |
| Visual direction | assets/images/DetectivePortraits/*, assets/images/KillerPortraits/*, docs/GDD.md, docs/design-notes/* |
