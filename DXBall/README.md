# DXBall 🎮

A faithful recreation of the classic brick-breaker arcade game, built with TypeScript and Phaser 3!

## About

DXBall is a classic brick-breaker game inspired by the iconic Breakout and Arkanoid arcade games. Use your paddle to bounce the ball and destroy all the bricks. Collect power-ups to enhance your gameplay with features like multi-ball and score multipliers!

## Features

- **4 Progressive Levels**: Increasing difficulty with unique brick layouts
- **Power-Up System**: 
  - Multi-ball power-ups for multiple balls in play
  - Score multipliers (2x, 3x, 4x, 5x) to boost your score
- **High Score Persistence**: Your best scores are saved locally
- **Arcade-Style Physics**: Smooth ball movement and collision detection
- **Sound Effects**: Classic arcade sound effects for hits, power-ups, and more
- **Retro Aesthetic**: Authentic arcade-style graphics and fonts

## Controls

### Desktop
- **Arrow Keys / Mouse**: Move the paddle left and right
- **Z Key / Space / Click**: Launch the ball
- **ESC**: Pause/unpause the game

### Mobile/Touch
- **Touch Controls**: On-screen buttons automatically appear on touch devices
  - **Left/Right Buttons**: Move the paddle left and right
  - **LAUNCH Button**: Launch the ball

## Gameplay

1. Start the game and press **Z** or **Space** to launch the ball
2. Move your paddle to keep the ball in play
3. Break all the bricks to advance to the next level
4. Collect falling power-ups for special abilities:
   - **Multi-ball**: Split into multiple balls
   - **Multipliers**: Increase your score (2x-5x)
5. Don't let the ball fall past your paddle!
6. Complete all 4 levels to win

## Technical Details

- **Language**: TypeScript
- **Game Engine**: Phaser 3
- **Build Tool**: Vite
- **Architecture**: Entity-Component-System inspired design with modular state management

## Building from Source

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The production build outputs to the `dist/` directory and is ready for deployment to GitHub Pages.

## Project Structure

```
DXBall/
├── src/
│   ├── main.ts           # Game entry point
│   ├── constants.ts      # Game constants
│   ├── types.ts          # TypeScript type definitions
│   ├── scenes/           # Phaser scenes
│   ├── state/            # Game state management
│   └── systems/          # Game systems (physics, levels, etc.)
├── public/
│   ├── images/           # Sprite assets
│   ├── sounds/           # Audio files
│   └── fonts/            # Font files
└── dist/                 # Built game (after npm run build)
```

## License

MIT License - See [LICENSE](../LICENSE) for details

---

**Part of the JDawg Games Collection**  
*Created for Jonathan Watkins (aka JDawg) by Grandpa Mark with love ❤️*
