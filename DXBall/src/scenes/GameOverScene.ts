import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT, HIGH_SCORE_DISPLAY_TIME } from '../constants';
import { gameState } from '../state/GameState';
import { GamePhase } from '../types';

export class GameOverScene extends Phaser.Scene {
  private displayTimer: number = HIGH_SCORE_DISPLAY_TIME;
  private initialsText!: Phaser.GameObjects.Text;
  private cursorBlink: boolean = true;
  private blinkTimer: number = 0;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    // Determine phase
    if (gameState.score > 0 && gameState.isHighScore()) {
      gameState.phase = GamePhase.ENTERING_INITIALS;
      this.showInitialsEntry();
    } else {
      gameState.phase = GamePhase.SHOWING_HIGH_SCORES;
      this.showHighScores();
    }

    // Setup input
    this.input.keyboard?.on('keydown-X', this.exitToTitle, this);
  }

  private showInitialsEntry(): void {
    // Game over / You win message
    const message = gameState.gameWon ? 'YOU WIN!' : 'GAME OVER';
    this.add.text(SCREEN_WIDTH / 2, 80, message, {
      fontSize: '48px',
      color: gameState.gameWon ? '#00ff00' : '#ff0000',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // Score display
    this.add.text(SCREEN_WIDTH / 2, 150, `Final Score: ${gameState.score}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // High score message
    this.add.text(SCREEN_WIDTH / 2, 200, 'NEW HIGH SCORE!', {
      fontSize: '28px',
      color: '#ffff00',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // Instructions
    this.add.text(SCREEN_WIDTH / 2, 260, 'Enter Your Initials:', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // Initials display (will be updated)
    this.initialsText = this.add.text(SCREEN_WIDTH / 2, 320, '_ _ _', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // Controls
    this.add.text(SCREEN_WIDTH / 2, 400, 'Type letters A-Z or use UP/DOWN to change', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    this.add.text(SCREEN_WIDTH / 2, 425, 'LEFT/RIGHT: Move cursor | BACKSPACE: Delete', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    this.add.text(SCREEN_WIDTH / 2, 450, 'ENTER: Submit', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // Arrow key handlers
    this.input.keyboard?.on('keydown-UP', this.cycleUp, this);
    this.input.keyboard?.on('keydown-DOWN', this.cycleDown, this);
    this.input.keyboard?.on('keydown-LEFT', this.moveLeft, this);
    this.input.keyboard?.on('keydown-RIGHT', this.moveRight, this);

    // Enter key to submit
    this.input.keyboard?.on('keydown-ENTER', this.submitInitials, this);

    // Backspace to delete
    this.input.keyboard?.on('keydown-BACKSPACE', this.handleBackspace, this);

    // Direct letter input (A-Z)
    this.input.keyboard?.on('keydown', this.handleKeyInput, this);

    // Initialize display
    this.updateInitialsDisplay();
  }

  private showHighScores(): void {
    this.displayTimer = HIGH_SCORE_DISPLAY_TIME;

    // Title
    this.add.text(SCREEN_WIDTH / 2, 60, 'HIGH SCORES', {
      fontSize: '36px',
      color: '#ffff00',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // If we just finished a game, show result
    if (gameState.score > 0) {
      const message = gameState.gameWon ? 'YOU WIN!' : 'GAME OVER';
      this.add.text(SCREEN_WIDTH / 2, 100, message, {
        fontSize: '24px',
        color: gameState.gameWon ? '#00ff00' : '#ff0000',
        fontFamily: 'monospace'
      }).setOrigin(0.5, 0.5);

      this.add.text(SCREEN_WIDTH / 2, 130, `Your Score: ${gameState.score}`, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'monospace'
      }).setOrigin(0.5, 0.5);
    }

    // Display high scores
    const startY = gameState.score > 0 ? 180 : 120;
    for (let i = 0; i < gameState.highScores.length; i++) {
      const entry = gameState.highScores[i];
      const rank = `${i + 1}.`.padStart(3, ' ');
      const initials = entry.initials.padEnd(3, '-');
      const score = entry.score.toString().padStart(6, ' ');

      this.add.text(SCREEN_WIDTH / 2, startY + i * 35, `${rank} ${initials} ${score}`, {
        fontSize: '22px',
        color: i < 3 ? '#ffff00' : '#ffffff',
        fontFamily: 'monospace'
      }).setOrigin(0.5, 0.5);
    }

    // Press X to continue
    this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 50, 'Press X, SPACE, or ENTER to Continue', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // Allow multiple keys to exit
    this.input.keyboard?.on('keydown-SPACE', this.exitToTitle, this);
    this.input.keyboard?.on('keydown-ENTER', this.exitToTitle, this);
  }

  private handleKeyInput(event: KeyboardEvent): void {
    if (gameState.phase !== GamePhase.ENTERING_INITIALS) return;

    // Check if it's a letter key (A-Z)
    const key = event.key.toUpperCase();
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      gameState.setInitialChar(key);
      this.updateInitialsDisplay();
    }
  }

  private handleBackspace(): void {
    if (gameState.phase !== GamePhase.ENTERING_INITIALS) return;

    const pos = gameState.initialsEntry.currentPosition;

    // Clear current position and move back
    gameState.initialsEntry.currentInitials[pos] = '-';

    if (pos > 0) {
      gameState.initialsEntry.currentPosition = pos - 1;
    }

    this.updateInitialsDisplay();
  }

  private cycleUp(): void {
    if (gameState.phase !== GamePhase.ENTERING_INITIALS) return;
    gameState.cycleInitialUp();
    this.updateInitialsDisplay();
  }

  private cycleDown(): void {
    if (gameState.phase !== GamePhase.ENTERING_INITIALS) return;
    gameState.cycleInitialDown();
    this.updateInitialsDisplay();
  }

  private moveLeft(): void {
    if (gameState.phase !== GamePhase.ENTERING_INITIALS) return;
    gameState.movePositionLeft();
    this.updateInitialsDisplay();
  }

  private moveRight(): void {
    if (gameState.phase !== GamePhase.ENTERING_INITIALS) return;
    gameState.movePositionRight();
    this.updateInitialsDisplay();
  }

  private updateInitialsDisplay(): void {
    const initials = gameState.initialsEntry.currentInitials;
    const pos = gameState.initialsEntry.currentPosition;

    // Show cursor on current position (3 characters now)
    let display = '';
    for (let i = 0; i < 3; i++) {
      if (i === pos && this.cursorBlink) {
        display += `[${initials[i]}]`;
      } else {
        display += ` ${initials[i]} `;
      }
    }

    this.initialsText.setText(display);
  }

  private submitInitials(): void {
    if (gameState.phase !== GamePhase.ENTERING_INITIALS) return;

    const initials = gameState.getInitials();
    gameState.addHighScore(initials);
    gameState.initialsEntered = true;
    gameState.phase = GamePhase.SHOWING_HIGH_SCORES;

    // Refresh scene to show high scores
    this.scene.restart();
  }

  private exitToTitle(): void {
    this.scene.start('TitleScene');
  }

  update(_time: number, delta: number): void {
    const deltaSeconds = delta / 1000;

    // Blink cursor during initials entry
    if (gameState.phase === GamePhase.ENTERING_INITIALS) {
      this.blinkTimer += deltaSeconds;
      if (this.blinkTimer >= 0.3) {
        this.blinkTimer = 0;
        this.cursorBlink = !this.cursorBlink;
        this.updateInitialsDisplay();
      }
    }

    // Auto-exit from high scores after timer
    if (gameState.phase === GamePhase.SHOWING_HIGH_SCORES) {
      this.displayTimer -= deltaSeconds;
      if (this.displayTimer <= 0) {
        this.exitToTitle();
      }
    }
  }
}
