import Phaser from 'phaser';
import { ASSETS, SCREEN_WIDTH, SCREEN_HEIGHT, EXIT_TIMER_TITLE } from '../constants';
import { gameState } from '../state/GameState';
import { GamePhase } from '../types';
import { TouchControls } from '../input/TouchControls';

export class TitleScene extends Phaser.Scene {
  private exitTimer: number = EXIT_TIMER_TITLE;
  private blinkTimer: number = 0;
  private startText!: Phaser.GameObjects.Text;
  private showText: boolean = true;
  private touchControls!: TouchControls;
  private previousLaunchPressed: boolean = false;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    // Reset game state
    gameState.phase = GamePhase.TITLE;
    this.exitTimer = EXIT_TIMER_TITLE;

    // Initialize touch controls
    this.touchControls = new TouchControls();

    // Display title image centered
    const title = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50, ASSETS.TITLE);
    title.setOrigin(0.5, 0.5);

    // Add "Press SPACE to Start" text with blinking effect
    this.startText = this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100, 'Press SPACE to Start', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'monospace'
    });
    this.startText.setOrigin(0.5, 0.5);

    // Add credits/info text
    this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 50, 'Mouse/Arrow Keys/Touch to move | Click/SPACE/Touch to launch', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 30, 'ESC to quit game',  {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0.5);

    // Setup input - multiple ways to start
    this.input.keyboard?.on('keydown-SPACE', this.startGame, this);
    this.input.keyboard?.on('keydown-ENTER', this.startGame, this);
    this.input.on('pointerdown', () => this.startGame());
  }

  update(_time: number, delta: number): void {
    const deltaSeconds = delta / 1000;

    // Update exit timer
    this.exitTimer -= deltaSeconds;
    if (this.exitTimer <= 0) {
      // In arcade context, this would return to attract mode
      // For web, we just reset the timer
      this.exitTimer = EXIT_TIMER_TITLE;
    }

    // Check for touch launch button press
    const currentLaunchPressed = this.touchControls.isLaunchPressed();
    if (currentLaunchPressed && !this.previousLaunchPressed) {
      this.startGame();
    }
    this.previousLaunchPressed = currentLaunchPressed;

    // Blink the start text
    this.blinkTimer += deltaSeconds;
    if (this.blinkTimer >= 0.5) {
      this.blinkTimer = 0;
      this.showText = !this.showText;
      this.startText.setVisible(this.showText);
    }
  }

  private startGame(): void {
    this.sound.play(ASSETS.SFX_START);
    gameState.reset();
    this.scene.start('GameScene');
  }
}
