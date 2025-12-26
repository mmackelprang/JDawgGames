import { GameScene } from '../scenes/GameScene';
import { BlockKind, PowerUpKind } from '../types';
import { BLOCK_WIDTH, BLOCK_HEIGHT } from '../constants';
import { gameState } from '../state/GameState';

// Spawns blocks for a specific level
export function spawnLevel(scene: GameScene, level: number): void {
  gameState.remainingBlocks = 0;
  gameState.blocksInLevel = 0;

  switch (level) {
    case 1:
      spawnLevel1(scene);
      break;
    case 2:
      spawnLevel2(scene);
      break;
    case 3:
      spawnLevel3(scene);
      break;
    case 4:
      spawnLevel4(scene);
      break;
  }

  // Assign power-ups randomly
  assignPowerUps(level);
}

// Level 1: Diamond/pyramid pattern, 32 blocks, single-hit only
function spawnLevel1(scene: GameScene): void {
  const startY = 100;

  // Row 1: 8 blocks centered
  for (let i = 0; i < 8; i++) {
    const x = 160 + i * BLOCK_WIDTH + BLOCK_WIDTH / 2;
    scene.createBlock(x, startY, BlockKind.SINGLE_HIT, PowerUpKind.NO_POWERUP);
  }

  // Row 2: 6 blocks
  for (let i = 0; i < 6; i++) {
    const x = 220 + i * BLOCK_WIDTH + BLOCK_WIDTH / 2;
    scene.createBlock(x, startY + BLOCK_HEIGHT, BlockKind.SINGLE_HIT, PowerUpKind.NO_POWERUP);
  }

  // Row 3: 6 blocks
  for (let i = 0; i < 6; i++) {
    const x = 220 + i * BLOCK_WIDTH + BLOCK_WIDTH / 2;
    scene.createBlock(x, startY + BLOCK_HEIGHT * 2, BlockKind.SINGLE_HIT, PowerUpKind.NO_POWERUP);
  }

  // Row 4: 4 blocks
  for (let i = 0; i < 4; i++) {
    const x = 280 + i * BLOCK_WIDTH + BLOCK_WIDTH / 2;
    scene.createBlock(x, startY + BLOCK_HEIGHT * 3, BlockKind.SINGLE_HIT, PowerUpKind.NO_POWERUP);
  }

  // Row 5: 4 blocks
  for (let i = 0; i < 4; i++) {
    const x = 280 + i * BLOCK_WIDTH + BLOCK_WIDTH / 2;
    scene.createBlock(x, startY + BLOCK_HEIGHT * 4, BlockKind.SINGLE_HIT, PowerUpKind.NO_POWERUP);
  }

  // Row 6: 2 blocks
  for (let i = 0; i < 2; i++) {
    const x = 340 + i * BLOCK_WIDTH + BLOCK_WIDTH / 2;
    scene.createBlock(x, startY + BLOCK_HEIGHT * 5, BlockKind.SINGLE_HIT, PowerUpKind.NO_POWERUP);
  }

  // Row 7: 2 blocks
  for (let i = 0; i < 2; i++) {
    const x = 340 + i * BLOCK_WIDTH + BLOCK_WIDTH / 2;
    scene.createBlock(x, startY + BLOCK_HEIGHT * 6, BlockKind.SINGLE_HIT, PowerUpKind.NO_POWERUP);
  }
}

// Level 2: Zigzag pattern, 35 blocks, mixed single/double hit
function spawnLevel2(scene: GameScene): void {
  const startY = 80;

  // Create a zigzag pattern with mixed block types
  const pattern = [
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  ];

  let blockCount = 0;
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col] === 1) {
        const x = 100 + col * BLOCK_WIDTH + BLOCK_WIDTH / 2;
        const y = startY + row * BLOCK_HEIGHT + BLOCK_HEIGHT / 2;
        // Alternate between single and double hit
        const kind = blockCount % 3 === 0 ? BlockKind.DOUBLE_HIT : BlockKind.SINGLE_HIT;
        scene.createBlock(x, y, kind, PowerUpKind.NO_POWERUP);
        blockCount++;
      }
    }
  }
}

// Level 3: Grid pattern with hidden blocks, 44 blocks
function spawnLevel3(scene: GameScene): void {
  const startY = 80;

  // Main grid: 4 rows x 8 columns of single-hit blocks
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 160 + col * BLOCK_WIDTH + BLOCK_WIDTH / 2;
      const y = startY + row * BLOCK_HEIGHT + BLOCK_HEIGHT / 2;
      scene.createBlock(x, y, BlockKind.SINGLE_HIT, PowerUpKind.NO_POWERUP);
    }
  }

  // Hidden blocks at bottom: 12 blocks in 2 rows
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      const x = 220 + col * BLOCK_WIDTH + BLOCK_WIDTH / 2;
      const y = startY + (row + 5) * BLOCK_HEIGHT + BLOCK_HEIGHT / 2;
      scene.createBlock(x, y, BlockKind.HIDDEN, PowerUpKind.NO_POWERUP);
    }
  }
}

// Level 4: Full grid, 120 blocks, all types randomized
function spawnLevel4(scene: GameScene): void {
  const startY = 60;
  const cols = 12;
  const rows = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 40 + col * BLOCK_WIDTH + BLOCK_WIDTH / 2;
      const y = startY + row * BLOCK_HEIGHT + BLOCK_HEIGHT / 2;

      // Random block type
      const rand = Math.random();
      let kind: BlockKind;
      if (rand < 0.6) {
        kind = BlockKind.SINGLE_HIT;
      } else if (rand < 0.85) {
        kind = BlockKind.DOUBLE_HIT;
      } else {
        kind = BlockKind.HIDDEN;
      }

      scene.createBlock(x, y, kind, PowerUpKind.NO_POWERUP);
    }
  }
}

// Assign power-ups to random blocks
function assignPowerUps(level: number): void {
  const blocks = gameState.blocks;
  const totalBlocks = blocks.length;

  // Determine power-up counts based on level
  let multiBallCount: number;
  let multiplierCount: number;

  switch (level) {
    case 1:
      multiBallCount = 4;
      multiplierCount = 2;
      break;
    case 2:
      multiBallCount = 6;
      multiplierCount = 3;
      break;
    case 3:
      multiBallCount = 8;
      multiplierCount = 4;
      break;
    case 4:
      multiBallCount = 15;
      multiplierCount = 10;
      break;
    default:
      multiBallCount = 4;
      multiplierCount = 2;
  }

  // Create array of indices and shuffle
  const indices: number[] = [];
  for (let i = 0; i < totalBlocks; i++) {
    indices.push(i);
  }
  shuffleArray(indices);

  // Assign multi-ball power-ups
  for (let i = 0; i < Math.min(multiBallCount, indices.length); i++) {
    blocks[indices[i]].powerUpKind = PowerUpKind.MULTI_BALL;
  }

  // Assign multiplier power-ups
  for (let i = multiBallCount; i < Math.min(multiBallCount + multiplierCount, indices.length); i++) {
    blocks[indices[i]].powerUpKind = PowerUpKind.SCORE_MULTIPLY;
  }
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
