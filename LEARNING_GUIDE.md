# 🎓 LEARNING GUIDE - Shadows of Judgment Development

## 📜 Learning Contract

**Goal:** Build this game while deeply understanding every line of code and concept.

**My Role as Your Guide:**
- ✅ Explain concepts before you code them
- ✅ Show you what to create and why
- ✅ Help you understand the Phaser 3 architecture
- ✅ Review your code when you need feedback
- ✅ Debug together when things don't work
- ✅ Answer questions about programming concepts

**Your Role as Developer:**
- ✅ Write your own code (I won't write it for you)
- ✅ Run your own terminal commands
- ✅ Ask questions when you don't understand
- ✅ Experiment and make mistakes
- ✅ Review and understand each concept before moving on

---

## 🗺️ Project Roadmap with Learning Objectives

### **Phase 1: Project Setup** ⬅️ YOU ARE HERE
**Learning Goals:**
- [ ] Understand project folder structure
- [ ] Learn terminal navigation (cd, mkdir, touch, ls)
- [ ] Understand how HTML loads JavaScript files
- [ ] Learn about npm and package.json

**Tasks:**
1. Create folder structure using terminal
2. Verify structure with `tree` or `ls` commands
3. Install dependencies with `npm install`

**Terminal Commands to Try:**
```bash
# Navigate to project
cd /Users/daviddiazclifton/Desktop/GITHUB/Game2

# Create folders
mkdir -p src/scenes src/data src/classes assets/images

# Create files
touch src/config.js src/main.js
touch src/scenes/BootScene.js src/scenes/MenuScene.js 
touch src/scenes/BattleScene.js src/scenes/GameOverScene.js
touch src/data/cards.js src/classes/Card.js src/classes/AI.js

# Check your work
ls -R src/
```

---

### **Phase 2: Understanding Phaser 3 Architecture**
**Learning Goals:**
- [ ] Understand what a game engine is
- [ ] Learn the Phaser Scene system
- [ ] Understand the game loop (create, update)
- [ ] Learn how Phaser renders graphics

**Key Concepts:**
- **Scene:** A container for game logic (like a "screen" or "level")
- **Game Config:** Settings that tell Phaser how to set up your game
- **Preload → Create → Update:** The lifecycle of a scene

---

### **Phase 3: Core Game Systems**
**Learning Goals:**
- [ ] Object-oriented programming (classes)
- [ ] Data structures (objects, arrays)
- [ ] State management (tracking game state)
- [ ] Event handling (user input)

**Concepts to Master:**
- Creating and using JavaScript classes
- Storing data in objects vs arrays
- Updating UI based on game state
- Handling button clicks

---

### **Phase 4: Game Logic**
**Learning Goals:**
- [ ] Conditional logic (if/else statements)
- [ ] Loop patterns (for, forEach)
- [ ] Function composition (breaking code into small functions)
- [ ] Win/loss condition checking

**Key Skills:**
- Writing clean, readable functions
- Organizing code logically
- Testing individual functions

---

### **Phase 5: AI Implementation**
**Learning Goals:**
- [ ] Random selection with Math.random()
- [ ] Weighted probability
- [ ] Decision-making algorithms
- [ ] Array filtering and sorting

**Challenge:**
- Start with random AI
- Improve to strategic AI
- Understand trade-offs in AI design

---

### **Phase 6: Polish & Testing**
**Learning Goals:**
- [ ] Debugging techniques
- [ ] Game balance testing
- [ ] Code refactoring
- [ ] Performance optimization basics

---

## 📚 JavaScript Concepts You'll Learn

### **ES6 Features:**
- `const` and `let` (vs old `var`)
- Arrow functions `() => {}`
- Template literals `` `Hello ${name}` ``
- Destructuring `const {x, y} = object`
- Spread operator `...array`
- Classes `class Card {}`

### **Core Programming:**
- Functions and parameters
- Objects and properties
- Arrays and array methods (map, filter, reduce, forEach)
- Conditionals (if/else, switch, ternary)
- Loops (for, while, forEach)

### **Game Development:**
- Object-oriented design
- State machines
- Event-driven programming
- Collision detection concepts
- UI/UX patterns

---

## 🎮 Phaser 3 Concepts You'll Master

### **Scene System:**
```javascript
class MyScene extends Phaser.Scene {
    preload() {
        // Load assets before the scene starts
    }
    
    create() {
        // Set up the scene (runs once)
    }
    
    update() {
        // Runs every frame (60 times per second)
    }
}
```

### **Core Phaser Objects:**
- **Sprites:** Visual game objects with textures
- **Text:** Displaying text on screen
- **Graphics:** Drawing shapes (rectangles, circles)
- **Input:** Handling mouse/touch events
- **Scenes:** Different game states/screens

### **Phaser Methods You'll Use:**
- `this.add.text()` - Create text
- `this.add.sprite()` - Create images
- `this.add.graphics()` - Draw shapes
- `this.input.on()` - Handle clicks
- `this.scene.start()` - Switch scenes

---

## 🔍 Debugging Skills You'll Develop

### **Console Methods:**
```javascript
console.log('Variable value:', myVar);
console.table(arrayOfObjects);
console.error('Something went wrong!');
```

### **Chrome DevTools:**
- Inspecting elements
- Reading console errors
- Using the debugger
- Checking network requests

### **Common Debugging Strategies:**
1. Read the error message carefully
2. Use console.log to track values
3. Check for typos in variable names
4. Verify file paths are correct
5. Test small pieces of code separately

---

## ✅ Progress Tracker

Update this as you complete each milestone:

- [ ] **Week 1:** Project setup complete, basic Phaser running
- [ ] **Week 2:** Scenes created, can navigate between them
- [ ] **Week 3:** Card system working, can display cards
- [ ] **Week 4:** Stats system working, bars update correctly
- [ ] **Week 5:** Turn system working, player can play cards
- [ ] **Week 6:** AI working, can play against computer
- [ ] **Week 7:** Win/loss conditions working
- [ ] **Week 8:** Basic art and polish complete
- [ ] **Week 9:** Testing and bug fixes
- [ ] **Week 10:** Final polish and deployment

---

## 🎯 Learning Checkpoints

After each major feature, answer these questions:

### **Checkpoint Questions:**
1. What did I just build?
2. How does it work (explain in plain English)?
3. What was the hardest part?
4. What would I do differently next time?
5. Can I explain this feature to someone else?

---

## 📖 Resources for Learning

### **Phaser 3 Documentation:**
- Official Docs: https://photonstorm.github.io/phaser3-docs/
- Examples: https://phaser.io/examples
- Labs: https://labs.phaser.io/

### **JavaScript Resources:**
- MDN Web Docs: https://developer.mozilla.org/
- JavaScript.info: https://javascript.info/

### **When You're Stuck:**
1. Read the error message
2. Check this learning guide
3. Look at Phaser examples
4. Ask me to explain the concept
5. Try to explain what you think should happen

---

## 🎓 Current Status

**Date Started:** December 13, 2025
**Current Phase:** Phase 1 - Project Setup
**Current Task:** Create folder structure
**Next Milestone:** Get basic Phaser window running

---

## 💬 Notes & Reflections

Use this space to write down:
- Things you learned
- Challenges you faced
- Questions that came up
- Ideas for improvements

---

**Remember:** Making mistakes is part of learning. Every error message is a learning opportunity!
