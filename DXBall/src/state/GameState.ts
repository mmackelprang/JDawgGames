import { BallData, BlockData, PowerUpDropData, HighScoreEntry, InitialsEntryData, GamePhase } from '../types';
import { MAX_MULTIPLIER } from '../constants';

export class GameState {
  // Entity collections
  public balls: BallData[] = [];
  public blocks: BlockData[] = [];
  public powerUpDrops: PowerUpDropData[] = [];

  // Level state
  public currentLevel: number = 1;
  public remainingBlocks: number = 0;
  public blocksInLevel: number = 0;

  // Game state
  public score: number = 0;
  public phase: GamePhase = GamePhase.TITLE;
  public gameWon: boolean = false;

  // Paddle state
  public paddleX: number = 400;
  public ballIsHeld: boolean = true;

  // Timers (in seconds)
  public multiplierTimer: number = 0;
  public extraBallTimer: number = 0;
  public exitTimer: number = 0;

  // Score multiplier
  public scoreMultiplier: number = 1;

  // High scores
  public highScores: HighScoreEntry[] = [];
  public initialsEntry: InitialsEntryData = {
    currentInitials: ['-', '-', '-'],
    currentPosition: 0
  };
  public initialsEntered: boolean = false;

  // Pending extra balls to spawn
  public pendingExtraBalls: number = 0;

  constructor() {
    this.loadHighScores();
  }

  public reset(): void {
    this.balls = [];
    this.blocks = [];
    this.powerUpDrops = [];
    this.currentLevel = 1;
    this.remainingBlocks = 0;
    this.blocksInLevel = 0;
    this.score = 0;
    this.phase = GamePhase.PLAYING;
    this.gameWon = false;
    this.paddleX = 400;
    this.ballIsHeld = true;
    this.multiplierTimer = 0;
    this.extraBallTimer = 0;
    this.scoreMultiplier = 1;
    this.initialsEntry = {
      currentInitials: ['-', '-', '-'],
      currentPosition: 0
    };
    this.initialsEntered = false;
    this.pendingExtraBalls = 0;
  }

  public resetForNewLevel(): void {
    this.balls = [];
    this.powerUpDrops = [];
    this.ballIsHeld = true;
    this.pendingExtraBalls = 0;
    // Keep score, multiplier timer, etc.
  }

  public incrementScore(): void {
    this.score += this.scoreMultiplier;
  }

  public increaseMultiplier(): void {
    if (this.scoreMultiplier < MAX_MULTIPLIER) {
      this.scoreMultiplier++;
    }
    this.multiplierTimer = 10; // Reset timer
  }

  public updateMultiplierTimer(delta: number): void {
    if (this.multiplierTimer > 0) {
      this.multiplierTimer -= delta;
      if (this.multiplierTimer <= 0) {
        this.multiplierTimer = 0;
        this.scoreMultiplier = 1;
      }
    }
  }

  public updateExtraBallTimer(delta: number): void {
    if (this.extraBallTimer > 0) {
      this.extraBallTimer -= delta;
      if (this.extraBallTimer <= 0) {
        this.extraBallTimer = 0;
        this.pendingExtraBalls++;
      }
    }
  }

  public scheduleExtraBall(): void {
    this.extraBallTimer = 5; // 5 second delay
  }

  public isHighScore(): boolean {
    if (this.highScores.length < 10) return true;
    return this.score > this.highScores[this.highScores.length - 1].score;
  }

  public addHighScore(initials: string): void {
    const newEntry: HighScoreEntry = {
      initials: initials,
      score: this.score
    };

    this.highScores.push(newEntry);
    this.highScores.sort((a, b) => b.score - a.score);
    this.highScores = this.highScores.slice(0, 10);
    this.saveHighScores();
  }

  public loadHighScores(): void {
    try {
      const saved = localStorage.getItem('dxball_highscores');
      if (saved) {
        this.highScores = JSON.parse(saved);
      } else {
        this.initializeDefaultHighScores();
      }
    } catch {
      this.initializeDefaultHighScores();
    }
  }

  private initializeDefaultHighScores(): void {
    this.highScores = [];
    for (let i = 0; i < 10; i++) {
      this.highScores.push({ initials: '---', score: 0 });
    }
  }

  public saveHighScores(): void {
    try {
      localStorage.setItem('dxball_highscores', JSON.stringify(this.highScores));
    } catch {
      console.warn('Could not save high scores to localStorage');
    }
  }

  public cycleInitialUp(): void {
    const pos = this.initialsEntry.currentPosition;
    const current = this.initialsEntry.currentInitials[pos];

    if (current === '-') {
      this.initialsEntry.currentInitials[pos] = 'A';
    } else if (current === 'Z') {
      this.initialsEntry.currentInitials[pos] = '-';
    } else {
      this.initialsEntry.currentInitials[pos] = String.fromCharCode(current.charCodeAt(0) + 1);
    }
  }

  public cycleInitialDown(): void {
    const pos = this.initialsEntry.currentPosition;
    const current = this.initialsEntry.currentInitials[pos];

    if (current === '-') {
      this.initialsEntry.currentInitials[pos] = 'Z';
    } else if (current === 'A') {
      this.initialsEntry.currentInitials[pos] = '-';
    } else {
      this.initialsEntry.currentInitials[pos] = String.fromCharCode(current.charCodeAt(0) - 1);
    }
  }

  public setInitialChar(char: string): void {
    const pos = this.initialsEntry.currentPosition;
    const upperChar = char.toUpperCase();

    // Only allow A-Z
    if (upperChar >= 'A' && upperChar <= 'Z') {
      this.initialsEntry.currentInitials[pos] = upperChar;
      // Auto-advance to next position
      if (pos < 2) {
        this.initialsEntry.currentPosition = pos + 1;
      }
    }
  }

  public movePositionLeft(): void {
    if (this.initialsEntry.currentPosition > 0) {
      this.initialsEntry.currentPosition--;
    }
  }

  public movePositionRight(): void {
    if (this.initialsEntry.currentPosition < 2) {
      this.initialsEntry.currentPosition++;
    }
  }

  public getInitials(): string {
    return this.initialsEntry.currentInitials.join('');
  }
}

// Singleton instance
export const gameState = new GameState();
