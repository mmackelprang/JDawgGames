import Phaser from 'phaser';
import { ASSETS, SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Show loading progress
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(SCREEN_WIDTH / 2 - 160, SCREEN_HEIGHT / 2 - 25, 320, 50);

    const loadingText = this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load images
    this.load.image(ASSETS.BALL, 'images/ball.png');
    this.load.image(ASSETS.PADDLE, 'images/platform.png');
    this.load.image(ASSETS.TITLE, 'images/title.png');
    this.load.image(ASSETS.ICON, 'images/icon.png');

    // Block sprites
    this.load.image(ASSETS.BLOCK_SINGLE, 'images/5.png');
    this.load.image(ASSETS.BLOCK_DOUBLE_1, 'images/8.png');
    this.load.image(ASSETS.BLOCK_DOUBLE_2, 'images/9.png');
    this.load.image(ASSETS.BLOCK_HIDDEN, 'images/transparent.png');
    this.load.image(ASSETS.BLOCK_HIDDEN_REVEALED, 'images/3.png');

    // Additional block variants
    this.load.image('1', 'images/1.png');
    this.load.image('2', 'images/2.png');
    this.load.image('4', 'images/4.png');
    this.load.image('6', 'images/6.png');
    this.load.image('7', 'images/7.png');
    this.load.image('10', 'images/10.png');

    // Power-up block overlays
    this.load.image(ASSETS.BLOCK_MULTIBALL, 'images/multiball_block.png');
    this.load.image(ASSETS.BLOCK_MULTIPLIER, 'images/multiplier_block.png');
    this.load.image(ASSETS.BLOCK_MULTIPLIER_3, 'images/multiplier_3_block.png');
    this.load.image(ASSETS.BLOCK_MULTIPLIER_4, 'images/multiplier_4_block.png');
    this.load.image(ASSETS.BLOCK_MULTIPLIER_5, 'images/multiplier_5_block.png');

    // Dropped power-ups
    this.load.image(ASSETS.DROP_MULTIBALL, 'images/dropped_multiball.png');
    this.load.image(ASSETS.DROP_MULTIPLIER, 'images/dropped_multiplier.png');
    this.load.image(ASSETS.DROP_MULTIPLIER_3, 'images/dropped_multiplier_3.png');
    this.load.image(ASSETS.DROP_MULTIPLIER_4, 'images/dropped_multiplier_4.png');
    this.load.image(ASSETS.DROP_MULTIPLIER_5, 'images/dropped_multiplier_5.png');

    // Gauge sprites
    this.load.image(ASSETS.GAUGE_EMPTY_2, 'images/gauge_empty_2.png');
    this.load.image(ASSETS.GAUGE_EMPTY_3, 'images/gauge_empty_3.png');
    this.load.image(ASSETS.GAUGE_EMPTY_4, 'images/gauge_empty_4.png');
    this.load.image(ASSETS.GAUGE_EMPTY_5, 'images/gauge_empty_5.png');
    this.load.image(ASSETS.GAUGE_FULL_2, 'images/gauge_full_2.png');
    this.load.image(ASSETS.GAUGE_FULL_3, 'images/gauge_full_3.png');
    this.load.image(ASSETS.GAUGE_FULL_4, 'images/gauge_full_4.png');
    this.load.image(ASSETS.GAUGE_FULL_5, 'images/gauge_full_5.png');

    // Load sounds
    this.load.audio(ASSETS.SFX_BREAK, 'sounds/hurt_c_08-102842.wav');
    this.load.audio(ASSETS.SFX_BOUNCE, 'sounds/stop-13692.wav');
    this.load.audio(ASSETS.SFX_POWERUP, 'sounds/video-game-powerup-38065.wav');
    this.load.audio(ASSETS.SFX_START, 'sounds/message-incoming-132126.wav');
    this.load.audio(ASSETS.SFX_WIN, 'sounds/winsquare-6993.wav');
  }

  create(): void {
    // Transition to title screen
    this.scene.start('TitleScene');
  }
}
