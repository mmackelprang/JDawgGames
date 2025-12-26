# DXBall Game Architecture

## Overview

DXBall is a classic brick-breaker arcade game implemented in C++ using the SplashKit SDK. The game features 4 levels of increasing difficulty, power-up systems, high score persistence, and arcade-compatible controls.

**Tech Stack:**
- Language: C++14
- Framework: SplashKit SDK
- Build: Clang++/G++ via SplashKit Manager (skm)
- Platforms: Windows (MSYS2), macOS, Linux, Raspberry Pi

---

## Project Structure

```
DXBallGame/
├── include/                    # Header files
│   ├── types.h                 # Core data structures
│   ├── global_constants.h      # Game constants (speeds, dimensions)
│   ├── global_state.h          # State management declarations
│   ├── global_instances.h      # Global instance declarations
│   ├── instance_state.h        # Physics/collision declarations
│   ├── instance_creation.h     # Factory function declarations
│   ├── level_creation.h        # Level generation declarations
│   ├── rendering.h             # Rendering declarations
│   ├── resources.h             # Asset loading declarations
│   └── high_scores.h           # Score persistence declarations
│
├── images/                     # Sprite assets (PNG)
│   ├── ball.png                # Ball sprite
│   ├── platform.png            # Paddle sprite
│   ├── title.png               # Title screen
│   ├── [1-10].png              # Block variants
│   ├── *_block.png             # Power-up block sprites
│   ├── dropped_*.png           # Falling power-up sprites
│   └── gauge_*.png             # Multiplier UI elements
│
├── sounds/                     # Audio assets (WAV)
│   ├── hurt_c_08-102842.wav    # Block break
│   ├── stop-13692.wav          # Ball bounce
│   ├── video-game-powerup-38065.wav
│   ├── message-incoming-132126.wav
│   └── winsquare-6993.wav
│
├── fonts/                      # Typography
│   └── VCR_OSD_MONO.ttf
│
├── json/                       # Persistent data
│   └── scores.json             # High score leaderboard
│
├── program.cpp                 # Entry point, game loop
├── global_state.cpp            # Game state management
├── instance_state.cpp          # Ball/block physics
├── level_creation.cpp          # Level spawning (4 levels)
├── rendering.cpp               # Graphics rendering
├── instance_creation.cpp       # Object factories
├── resources.cpp               # Asset loading
└── high_scores.cpp             # Score persistence
```

---

## Core Data Structures

### GameData (Central State Container)
```cpp
struct GameData {
    // Entity collections
    unique_ptr<BlockData[]> blocks;           // Level blocks (heap allocated)
    vector<PowerUpDropData> current_power_ups; // Falling power-ups
    vector<BallData> current_balls;           // Active balls

    // Level state
    int remaining_blocks;
    int blocks_in_level;
    int current_level;          // 1-4
    bool next_level;            // Level transition flag

    // Game state
    int score;
    bool game_start;
    bool game_over;
    bool game_won;

    // Timers (seconds)
    double multiplier_timer;    // Score multiplier duration (10s)
    double extra_ball_timer;    // Multi-ball spawn delay (5s)
    double exit_timer;          // Auto-return to title (600s)

    // Paddle
    double paddle_x;
    bool ball_is_held;

    // Score multiplier
    int score_multiplier;       // 1-5x

    // High scores
    json scores;
    json score_rows[10];
    bool initials_entered;
};
```

### BlockData
```cpp
struct BlockData {
    double x, y;                // Position
    BlockKind kind;             // SINGLE_HIT, DOUBLE_HIT, HIDDEN
    PowerUpKind power_up_kind;  // MULTI_BALL, SCORE_MULTIPLY, NO_POWERUP
    int hit_points;             // Remaining hits (1-2)
    string block_bitmap;        // Sprite identifier
    string power_up_bitmap;     // Power-up overlay sprite
};
```

### BallData
```cpp
struct BallData {
    double x, y;                // Position
    bool up;                    // Y direction
    bool right;                 // X direction
};
```

### PowerUpDropData
```cpp
struct PowerUpDropData {
    double x, y;                // Position (falls at BALL_SPEED/2)
    PowerUpKind kind;           // Type of power-up
};
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         program.cpp                              │
│                      (Main Game Loop)                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  while (!game_closed) {                                     ││
│  │      process_events()           // SplashKit input polling  ││
│  │      update_timers()            // Decrement game timers    ││
│  │      handle_input()             // Paddle, buttons          ││
│  │      update_game_logic()        // Physics, collisions      ││
│  │      draw_game()                // Render frame             ││
│  │      refresh_screen(60)         // 60 FPS cap               ││
│  │  }                                                          ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ global_state  │     │ instance_state  │     │   rendering     │
│    .cpp       │     │     .cpp        │     │     .cpp        │
├───────────────┤     ├─────────────────┤     ├─────────────────┤
│ reset_game()  │     │ check_ball_     │     │ draw_blocks()   │
│ start_level() │     │   collision()   │     │ draw_game()     │
│ end_game()    │     │ update_ball_    │     │ show_title_     │
│ update_game() │     │   location()    │     │   screen()      │
└───────────────┘     │ update_power_   │     └─────────────────┘
        │             │   up_drops()    │
        │             └─────────────────┘
        ▼                       │
┌───────────────┐               │
│level_creation │               ▼
│    .cpp       │     ┌─────────────────┐
├───────────────┤     │instance_creation│
│ spawn_level1()│     │     .cpp        │
│ spawn_level2()│     ├─────────────────┤
│ spawn_level3()│     │ create_block()  │
│ spawn_level4()│     │ create_ball()   │
└───────────────┘     └─────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│            resources.cpp               │
│     (Asset Loading - SplashKit)        │
├───────────────────────────────────────┤
│ load_block_bitmaps()                   │
│ load_ball_bitmaps()                    │
│ load_platform_bitmaps()                │
│ load_ui_bitmaps()                      │
│ load_sound_effects()                   │
└───────────────────────────────────────┘
```

---

## Game State Machine

```
                    ┌──────────────┐
                    │ TITLE_SCREEN │◄────────────────────────┐
                    └──────┬───────┘                         │
                           │ START key                       │
                           ▼                                 │
                    ┌──────────────┐                         │
              ┌────►│ LEVEL_START  │                         │
              │     │ (reset ball) │                         │
              │     └──────┬───────┘                         │
              │            │                                 │
              │            ▼                                 │
              │     ┌──────────────┐                         │
              │     │   GAMEPLAY   │                         │
              │     │ (physics on) │                         │
              │     └──────┬───────┘                         │
              │            │                                 │
              │     ┌──────┴──────┐                          │
              │     │             │                          │
              │     ▼             ▼                          │
        ┌──────────────┐  ┌──────────────┐                   │
        │ BLOCKS_CLEAR │  │  BALL_LOST   │                   │
        │ (next level?)│  │ (game over)  │                   │
        └──────┬───────┘  └──────┬───────┘                   │
               │                 │                           │
        ┌──────┴──────┐          │                           │
        │             │          │                           │
        ▼             ▼          ▼                           │
 ┌────────────┐ ┌───────────────────┐                        │
 │ MORE_LEVELS│ │    GAME_OVER      │                        │
 │ (level++)  │ │ (win or lose)     │                        │
 └─────┬──────┘ └────────┬──────────┘                        │
       │                 │                                   │
       │                 ▼                                   │
       │          ┌──────────────┐                           │
       │          │INITIALS_ENTRY│ (if high score)           │
       │          └──────┬───────┘                           │
       │                 │                                   │
       │                 ▼                                   │
       │          ┌──────────────┐                           │
       │          │ HIGH_SCORES  │                           │
       │          │  DISPLAY     │                           │
       │          └──────┬───────┘                           │
       │                 │ exit_timer expires                │
       └─────────────────┴───────────────────────────────────┘
```

---

## Physics System

### Ball Movement
- Constant velocity: 4 pixels/frame (`BALL_SPEED`)
- 4 diagonal directions determined by `up` and `right` booleans
- No acceleration or variable speed

### Collision Detection (AABB)
```
Ball-Block Collision:
┌────────────────────┐
│      BLOCK         │  ← Top/bottom hit: reverse ball.up
│                    │  ← Left/right hit: reverse ball.right
└────────────────────┘

Ball-Paddle Collision:
┌────────────────────┐
│      PADDLE        │  ← Always bounces ball upward
└────────────────────┘

Ball-Wall Collision:
← Left wall:   ball.right = true
→ Right wall:  ball.right = false
↑ Top wall:    ball.up = false
↓ Bottom:      Ball lost (game over check)
```

### Screen Dimensions
- Window: 800 x 600 pixels
- Blocks: 60 x 20 pixels
- Paddle: 100 x 5 pixels at Y=550
- Ball: 8-pixel radius
- Paddle bounds: 10px from screen edges

---

## Power-Up System

### Block Power-Ups
| Type | Effect | Duration |
|------|--------|----------|
| MULTI_BALL | Spawns additional ball | 5s delay |
| SCORE_MULTIPLY | Increases multiplier (max 5x) | 10s |

### Power-Up Flow
1. Block with power-up destroyed
2. PowerUpDropData spawned at block position
3. Drop falls at `BALL_SPEED / 2`
4. Paddle catches drop → effect activated
5. Drop falls off screen → lost

---

## Level Design

| Level | Blocks | Pattern | Block Types |
|-------|--------|---------|-------------|
| 1 | 32 | Diamond/pyramid | Single-hit only |
| 2 | 35 | Diagonal zigzag | Single + Double-hit |
| 3 | 44 | 4x8 grid + hidden | Single + Hidden |
| 4 | 120 | 10x12 full grid | All types (random) |

### Power-Up Distribution (Random)
- Level 1-3: 12 multi-ball, 5 multiplier blocks
- Level 4: Up to 50 multi-ball, 30 multiplier blocks

---

## Input Mapping

### Gameplay Controls
| Action | Primary Key | Arcade Mapping |
|--------|------------|----------------|
| Move Left | LEFT_KEY | Joystick left |
| Move Right | RIGHT_KEY | Joystick right |
| Launch Ball | Z_KEY | P1 Button 1 |
| Start Game | SPACE | Start button |
| Exit | X_KEY | P1 Button 2 |

### High Score Entry
| Action | Key |
|--------|-----|
| Next letter | UP_KEY |
| Previous letter | DOWN_KEY |
| Select initial | LEFT/RIGHT_KEY |
| Submit | Z_KEY |

---

## Data Persistence

### High Scores (JSON)
```json
{
    "default_values": { "initials": "--", "score": 0 },
    "row0": { "initials": "AB", "score": 1500 },
    "row1": { "initials": "CD", "score": 1200 },
    ...
    "row9": { "initials": "--", "score": 0 }
}
```

Location: `json/scores.json`

---

## Known Architectural Issues

1. **Global State Mutation**: Functions implicitly modify global `game_data` without explicit parameters
2. **Mixed Responsibilities**: `end_game()` performs both state updates and rendering
3. **Hardcoded Levels**: Level layouts defined procedurally in code rather than data files
4. **No Entity-Component System**: Direct struct manipulation instead of ECS pattern

---

## Build Instructions

### Windows (MSYS2)
```bash
bash.exe --login ~/.splashkit/skm clang++ -g *.cpp -o DXBallGame
```

### macOS / Linux
```bash
skm clang++ -g *.cpp -o DXBallGame
```

### Run
```bash
./DXBallGame
```

---

## Code Metrics

| Metric | Value |
|--------|-------|
| Total Source Lines | ~854 |
| Implementation Files | 8 |
| Header Files | 12 |
| Image Assets | ~34 |
| Sound Effects | 5 |
| Executable Size | ~3.8 MB |
