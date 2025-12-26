// Block types matching the C++ BlockKind enum
export enum BlockKind {
  SINGLE_HIT = 'SINGLE_HIT',
  DOUBLE_HIT = 'DOUBLE_HIT',
  HIDDEN = 'HIDDEN'
}

// Power-up types matching the C++ PowerUpKind enum
export enum PowerUpKind {
  MULTI_BALL = 'MULTI_BALL',
  SCORE_MULTIPLY = 'SCORE_MULTIPLY',
  NO_POWERUP = 'NO_POWERUP'
}

// Ball data structure
export interface BallData {
  x: number;
  y: number;
  up: boolean;
  right: boolean;
  sprite?: Phaser.GameObjects.Sprite;
}

// Block data structure
export interface BlockData {
  x: number;
  y: number;
  kind: BlockKind;
  powerUpKind: PowerUpKind;
  hitPoints: number;
  blockBitmap: string;
  powerUpBitmap: string;
  sprite?: Phaser.GameObjects.Sprite;
  powerUpSprite?: Phaser.GameObjects.Sprite;
  active: boolean;
}

// Power-up drop data structure
export interface PowerUpDropData {
  x: number;
  y: number;
  kind: PowerUpKind;
  sprite?: Phaser.GameObjects.Sprite;
}

// High score entry
export interface HighScoreEntry {
  initials: string;
  score: number;
}

// Initials entry state
export interface InitialsEntryData {
  currentInitials: string[];
  currentPosition: number; // 0 or 1
}

// Game state enum for state machine
export enum GamePhase {
  TITLE = 'TITLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  GAME_WON = 'GAME_WON',
  ENTERING_INITIALS = 'ENTERING_INITIALS',
  SHOWING_HIGH_SCORES = 'SHOWING_HIGH_SCORES'
}
