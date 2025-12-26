// Screen dimensions
export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 600;

// Ball physics - Original: 4 pixels per frame at 60fps = 240 pixels/sec
export const BALL_SPEED = 240;
export const BALL_RADIUS = 8;

// Paddle dimensions and position
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 5;
export const PADDLE_Y = 550;
export const PADDLE_SPEED = 300; // Pixels per second
export const PADDLE_BOUNDARY = 10; // Distance from screen edge

// Block dimensions
export const BLOCK_WIDTH = 60;
export const BLOCK_HEIGHT = 20;

// Power-up physics
export const POWERUP_FALL_SPEED = BALL_SPEED / 2; // 120 pixels/sec

// Timers (in seconds)
export const MULTIPLIER_DURATION = 10;
export const EXTRA_BALL_DELAY = 5;
export const EXIT_TIMER_TITLE = 600;
export const HIGH_SCORE_DISPLAY_TIME = 120;

// Scoring
export const MAX_MULTIPLIER = 5;

// Level block counts
export const LEVEL_1_BLOCKS = 32;
export const LEVEL_2_BLOCKS = 35;
export const LEVEL_3_BLOCKS = 44;
export const LEVEL_4_BLOCKS = 120;

// Power-up distribution
export const LEVEL_1_MULTIBALL_COUNT = 12;
export const LEVEL_1_MULTIPLIER_COUNT = 5;
export const LEVEL_4_MULTIBALL_COUNT = 50;
export const LEVEL_4_MULTIPLIER_COUNT = 30;

// Asset keys
export const ASSETS = {
  // Images
  BALL: 'ball',
  PADDLE: 'platform',
  TITLE: 'title',
  ICON: 'icon',

  // Block sprites
  BLOCK_SINGLE: '5',
  BLOCK_DOUBLE_1: '8',
  BLOCK_DOUBLE_2: '9',
  BLOCK_HIDDEN: 'transparent',
  BLOCK_HIDDEN_REVEALED: '3',

  // Power-up block overlays
  BLOCK_MULTIBALL: 'multiball_block',
  BLOCK_MULTIPLIER: 'multiplier_block',
  BLOCK_MULTIPLIER_3: 'multiplier_3_block',
  BLOCK_MULTIPLIER_4: 'multiplier_4_block',
  BLOCK_MULTIPLIER_5: 'multiplier_5_block',

  // Dropped power-ups
  DROP_MULTIBALL: 'dropped_multiball',
  DROP_MULTIPLIER: 'dropped_multiplier',
  DROP_MULTIPLIER_3: 'dropped_multiplier_3',
  DROP_MULTIPLIER_4: 'dropped_multiplier_4',
  DROP_MULTIPLIER_5: 'dropped_multiplier_5',

  // Gauge sprites
  GAUGE_EMPTY_2: 'gauge_empty_2',
  GAUGE_EMPTY_3: 'gauge_empty_3',
  GAUGE_EMPTY_4: 'gauge_empty_4',
  GAUGE_EMPTY_5: 'gauge_empty_5',
  GAUGE_FULL_2: 'gauge_full_2',
  GAUGE_FULL_3: 'gauge_full_3',
  GAUGE_FULL_4: 'gauge_full_4',
  GAUGE_FULL_5: 'gauge_full_5',

  // Sounds
  SFX_BREAK: 'sfx_break',
  SFX_BOUNCE: 'sfx_bounce',
  SFX_POWERUP: 'sfx_powerup',
  SFX_START: 'sfx_start',
  SFX_WIN: 'sfx_win',

  // Font
  FONT: 'VCR_OSD_MONO'
} as const;

// Key bindings matching original
export const KEYS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
  LAUNCH: 'Z',
  START: 'SPACE',
  EXIT: 'X',
  // Debug keys (optional)
  DEBUG_TIMER: 'NUMPAD_SEVEN',
  DEBUG_GAMEOVER: 'NUMPAD_EIGHT',
  DEBUG_NEXTLEVEL: 'NUMPAD_NINE',
  DEBUG_MULTIPLIER: 'NUMPAD_ZERO'
} as const;
