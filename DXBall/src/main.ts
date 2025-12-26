import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

// Phaser game configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, GameScene, GameOverScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  audio: {
    disableWebAudio: false
  },
  render: {
    pixelArt: true,
    antialias: false
  }
};

// Create the game instance
new Phaser.Game(config);
