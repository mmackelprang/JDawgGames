import Phaser from 'phaser';
import {
  ASSETS, SCREEN_WIDTH, SCREEN_HEIGHT, BALL_SPEED, BALL_RADIUS,
  PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_Y, PADDLE_SPEED, PADDLE_BOUNDARY,
  BLOCK_WIDTH, BLOCK_HEIGHT, POWERUP_FALL_SPEED
} from '../constants';
import { gameState } from '../state/GameState';
import { BlockKind, PowerUpKind, BallData, BlockData, PowerUpDropData, GamePhase } from '../types';
import { spawnLevel } from '../systems/LevelSystem';
import { TouchControls } from '../input/TouchControls';

export class GameScene extends Phaser.Scene {
  private paddle!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private launchKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private escapeKey!: Phaser.Input.Keyboard.Key;
  private touchControls!: TouchControls;
  private previousLaunchPressed: boolean = false;

  // UI elements
  private scoreText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private multiplierText!: Phaser.GameObjects.Text;
  private gaugeSprites: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    gameState.phase = GamePhase.PLAYING;

    // Get touch controls instance
    this.touchControls = TouchControls.getInstance();

    // Draw visible borders
    this.createBorders();

    // Create paddle
    this.paddle = this.add.sprite(SCREEN_WIDTH / 2, PADDLE_Y, ASSETS.PADDLE);
    this.paddle.setOrigin(0.5, 0.5);
    gameState.paddleX = SCREEN_WIDTH / 2;

    // Setup keyboard input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.launchKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escapeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Setup mouse input
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.handleMouseMove(pointer);
    });

    this.input.on('pointerdown', () => {
      this.launchBall();
    });

    // Create UI
    this.createUI();

    // Spawn first level
    this.startLevel(gameState.currentLevel);
  }

  private createBorders(): void {
    const graphics = this.add.graphics();
    const borderColor = 0x4444ff;
    const borderWidth = 4;

    graphics.lineStyle(borderWidth, borderColor, 1);

    // Left border
    graphics.lineBetween(borderWidth / 2, 0, borderWidth / 2, SCREEN_HEIGHT);

    // Right border
    graphics.lineBetween(SCREEN_WIDTH - borderWidth / 2, 0, SCREEN_WIDTH - borderWidth / 2, SCREEN_HEIGHT);

    // Top border
    graphics.lineBetween(0, borderWidth / 2, SCREEN_WIDTH, borderWidth / 2);
  }

  private createUI(): void {
    // Score display
    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'monospace'
    });

    // Level display
    this.levelText = this.add.text(SCREEN_WIDTH - 10, 10, 'Level: 1', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(1, 0);

    // Multiplier display
    this.multiplierText = this.add.text(SCREEN_WIDTH / 2, 10, '', {
      fontSize: '18px',
      color: '#ffff00',
      fontFamily: 'monospace'
    }).setOrigin(0.5, 0);
  }

  private startLevel(level: number): void {
    // Clear existing entities
    this.clearLevel();

    gameState.resetForNewLevel();
    gameState.currentLevel = level;

    // Spawn blocks for this level
    spawnLevel(this, level);

    // Create initial ball
    this.createBall(gameState.paddleX, PADDLE_Y - BALL_RADIUS - PADDLE_HEIGHT / 2, true);

    // Update UI
    this.levelText.setText(`Level: ${level}`);
  }

  private clearLevel(): void {
    // Destroy ball sprites
    for (const ball of gameState.balls) {
      ball.sprite?.destroy();
    }
    gameState.balls = [];

    // Destroy block sprites
    for (const block of gameState.blocks) {
      block.sprite?.destroy();
      block.powerUpSprite?.destroy();
    }
    gameState.blocks = [];

    // Destroy power-up sprites
    for (const drop of gameState.powerUpDrops) {
      drop.sprite?.destroy();
    }
    gameState.powerUpDrops = [];

    // Clear gauge sprites
    for (const gauge of this.gaugeSprites) {
      gauge.destroy();
    }
    this.gaugeSprites = [];
  }

  public createBall(x: number, y: number, held: boolean = false): BallData {
    const sprite = this.add.sprite(x, y, ASSETS.BALL);
    sprite.setOrigin(0.5, 0.5);

    const ball: BallData = {
      x,
      y,
      up: true,
      right: Math.random() > 0.5,
      sprite
    };

    gameState.balls.push(ball);
    gameState.ballIsHeld = held;

    return ball;
  }

  public createBlock(x: number, y: number, kind: BlockKind, powerUpKind: PowerUpKind): BlockData {
    // Determine bitmap based on kind
    let bitmap: string;
    let hitPoints: number;

    switch (kind) {
      case BlockKind.SINGLE_HIT:
        bitmap = ASSETS.BLOCK_SINGLE;
        hitPoints = 1;
        break;
      case BlockKind.DOUBLE_HIT:
        bitmap = ASSETS.BLOCK_DOUBLE_1;
        hitPoints = 2;
        break;
      case BlockKind.HIDDEN:
        bitmap = ASSETS.BLOCK_HIDDEN;
        hitPoints = 2;
        break;
    }

    const sprite = this.add.sprite(x, y, bitmap);
    sprite.setOrigin(0.5, 0.5);

    // Create power-up overlay if applicable
    let powerUpSprite: Phaser.GameObjects.Sprite | undefined;
    let powerUpBitmap = '';

    if (powerUpKind !== PowerUpKind.NO_POWERUP) {
      if (powerUpKind === PowerUpKind.MULTI_BALL) {
        powerUpBitmap = ASSETS.BLOCK_MULTIBALL;
      } else {
        powerUpBitmap = ASSETS.BLOCK_MULTIPLIER;
      }

      if (kind !== BlockKind.HIDDEN) {
        powerUpSprite = this.add.sprite(x, y, powerUpBitmap);
        powerUpSprite.setOrigin(0.5, 0.5);
      }
    }

    const block: BlockData = {
      x,
      y,
      kind,
      powerUpKind,
      hitPoints,
      blockBitmap: bitmap,
      powerUpBitmap,
      sprite,
      powerUpSprite,
      active: true
    };

    gameState.blocks.push(block);
    gameState.remainingBlocks++;
    gameState.blocksInLevel++;

    return block;
  }

  update(_time: number, delta: number): void {
    const deltaSeconds = delta / 1000;

    // Update timers
    gameState.updateMultiplierTimer(deltaSeconds);
    gameState.updateExtraBallTimer(deltaSeconds);

    // Handle pending extra balls
    while (gameState.pendingExtraBalls > 0) {
      gameState.pendingExtraBalls--;
      this.createBall(gameState.paddleX, PADDLE_Y - BALL_RADIUS - PADDLE_HEIGHT / 2, false);
      // Set the new ball moving
      const newBall = gameState.balls[gameState.balls.length - 1];
      newBall.up = true;
      newBall.right = Math.random() > 0.5;
    }

    // Handle input
    this.handleInput(deltaSeconds);

    // Update balls
    this.updateBalls(deltaSeconds);

    // Update power-up drops
    this.updatePowerUpDrops(deltaSeconds);

    // Update UI
    this.updateUI();

    // Check win condition
    if (gameState.remainingBlocks <= 0) {
      this.onLevelComplete();
    }
  }

  private handleMouseMove(pointer: Phaser.Input.Pointer): void {
    // Move paddle to mouse X position
    const halfPaddle = PADDLE_WIDTH / 2;
    gameState.paddleX = Phaser.Math.Clamp(
      pointer.x,
      PADDLE_BOUNDARY + halfPaddle,
      SCREEN_WIDTH - PADDLE_BOUNDARY - halfPaddle
    );
  }

  private launchBall(): void {
    if (gameState.ballIsHeld) {
      gameState.ballIsHeld = false;
      this.sound.play(ASSETS.SFX_BOUNCE, { volume: 0.25 });
    }
  }

  private handleInput(deltaSeconds: number): void {
    // ESC key to end game
    if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      this.onGameOver(false);
      return;
    }

    // Keyboard paddle movement
    if (this.cursors.left.isDown) {
      gameState.paddleX -= PADDLE_SPEED * deltaSeconds;
    }
    if (this.cursors.right.isDown) {
      gameState.paddleX += PADDLE_SPEED * deltaSeconds;
    }

    // Touch paddle movement
    if (this.touchControls.isLeftPressed()) {
      gameState.paddleX -= PADDLE_SPEED * deltaSeconds;
    }
    if (this.touchControls.isRightPressed()) {
      gameState.paddleX += PADDLE_SPEED * deltaSeconds;
    }

    // Clamp paddle position
    const halfPaddle = PADDLE_WIDTH / 2;
    gameState.paddleX = Phaser.Math.Clamp(
      gameState.paddleX,
      PADDLE_BOUNDARY + halfPaddle,
      SCREEN_WIDTH - PADDLE_BOUNDARY - halfPaddle
    );

    this.paddle.x = gameState.paddleX;

    // Ball launch with Z or Space key
    if ((Phaser.Input.Keyboard.JustDown(this.launchKey) ||
         Phaser.Input.Keyboard.JustDown(this.spaceKey)) &&
        gameState.ballIsHeld) {
      this.launchBall();
    }

    // Touch launch with debouncing
    const currentLaunchPressed = this.touchControls.isLaunchPressed();
    if (currentLaunchPressed && !this.previousLaunchPressed && gameState.ballIsHeld) {
      this.launchBall();
    }
    this.previousLaunchPressed = currentLaunchPressed;

    // Update held ball position
    if (gameState.ballIsHeld && gameState.balls.length > 0) {
      const heldBall = gameState.balls[0];
      heldBall.x = gameState.paddleX;
      heldBall.y = PADDLE_Y - BALL_RADIUS - PADDLE_HEIGHT / 2;
      heldBall.sprite!.x = heldBall.x;
      heldBall.sprite!.y = heldBall.y;
    }
  }

  private updateBalls(deltaSeconds: number): void {
    const ballsToRemove: number[] = [];

    for (let i = 0; i < gameState.balls.length; i++) {
      const ball = gameState.balls[i];

      // Skip held ball
      if (gameState.ballIsHeld && i === 0) continue;

      // Move ball
      const speed = BALL_SPEED * deltaSeconds;
      ball.x += ball.right ? speed : -speed;
      ball.y += ball.up ? -speed : speed;

      // Wall collisions
      if (ball.x <= BALL_RADIUS) {
        ball.x = BALL_RADIUS;
        ball.right = true;
        this.sound.play(ASSETS.SFX_BOUNCE, { volume: 0.25 });
      }
      if (ball.x >= SCREEN_WIDTH - BALL_RADIUS) {
        ball.x = SCREEN_WIDTH - BALL_RADIUS;
        ball.right = false;
        this.sound.play(ASSETS.SFX_BOUNCE, { volume: 0.25 });
      }
      if (ball.y <= BALL_RADIUS) {
        ball.y = BALL_RADIUS;
        ball.up = false;
        this.sound.play(ASSETS.SFX_BOUNCE, { volume: 0.25 });
      }

      // Bottom - ball lost
      if (ball.y >= SCREEN_HEIGHT + BALL_RADIUS) {
        ballsToRemove.push(i);
        continue;
      }

      // Paddle collision
      if (this.checkPaddleCollision(ball)) {
        ball.up = true;
        ball.y = PADDLE_Y - PADDLE_HEIGHT / 2 - BALL_RADIUS;
        this.sound.play(ASSETS.SFX_BOUNCE, { volume: 0.25 });
      }

      // Block collisions
      this.checkBlockCollisions(ball);

      // Update sprite position
      ball.sprite!.x = ball.x;
      ball.sprite!.y = ball.y;
    }

    // Remove lost balls (in reverse order)
    for (let i = ballsToRemove.length - 1; i >= 0; i--) {
      const idx = ballsToRemove[i];
      gameState.balls[idx].sprite?.destroy();
      gameState.balls.splice(idx, 1);
    }

    // Check game over (no balls left)
    if (gameState.balls.length === 0 && !gameState.ballIsHeld) {
      this.onGameOver(false);
    }
  }

  private checkPaddleCollision(ball: BallData): boolean {
    const paddleLeft = gameState.paddleX - PADDLE_WIDTH / 2;
    const paddleRight = gameState.paddleX + PADDLE_WIDTH / 2;
    const paddleTop = PADDLE_Y - PADDLE_HEIGHT / 2;
    const paddleBottom = PADDLE_Y + PADDLE_HEIGHT / 2;

    return (
      ball.x + BALL_RADIUS > paddleLeft &&
      ball.x - BALL_RADIUS < paddleRight &&
      ball.y + BALL_RADIUS > paddleTop &&
      ball.y - BALL_RADIUS < paddleBottom &&
      !ball.up // Only collide when moving down
    );
  }

  private checkBlockCollisions(ball: BallData): void {
    for (const block of gameState.blocks) {
      if (!block.active) continue;

      const blockLeft = block.x - BLOCK_WIDTH / 2;
      const blockRight = block.x + BLOCK_WIDTH / 2;
      const blockTop = block.y - BLOCK_HEIGHT / 2;
      const blockBottom = block.y + BLOCK_HEIGHT / 2;

      // AABB collision
      if (
        ball.x + BALL_RADIUS > blockLeft &&
        ball.x - BALL_RADIUS < blockRight &&
        ball.y + BALL_RADIUS > blockTop &&
        ball.y - BALL_RADIUS < blockBottom
      ) {
        // Determine bounce direction
        const overlapLeft = ball.x + BALL_RADIUS - blockLeft;
        const overlapRight = blockRight - (ball.x - BALL_RADIUS);
        const overlapTop = ball.y + BALL_RADIUS - blockTop;
        const overlapBottom = blockBottom - (ball.y - BALL_RADIUS);

        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        if (minOverlapX < minOverlapY) {
          // Horizontal bounce
          ball.right = overlapLeft > overlapRight;
        } else {
          // Vertical bounce
          ball.up = overlapTop > overlapBottom;
        }

        // Hit the block
        this.hitBlock(block);

        // Only hit one block per frame
        break;
      }
    }
  }

  private hitBlock(block: BlockData): void {
    block.hitPoints--;
    gameState.incrementScore();

    if (block.hitPoints <= 0) {
      // Block destroyed
      block.active = false;
      block.sprite?.destroy();
      block.powerUpSprite?.destroy();
      gameState.remainingBlocks--;

      this.sound.play(ASSETS.SFX_BREAK);

      // Spawn power-up drop
      if (block.powerUpKind !== PowerUpKind.NO_POWERUP) {
        this.spawnPowerUpDrop(block.x, block.y, block.powerUpKind);
      }
    } else {
      // Block damaged - update sprite
      if (block.kind === BlockKind.DOUBLE_HIT) {
        block.sprite?.setTexture(ASSETS.BLOCK_DOUBLE_2);
      } else if (block.kind === BlockKind.HIDDEN) {
        block.sprite?.setTexture(ASSETS.BLOCK_HIDDEN_REVEALED);
        // Show power-up overlay if present
        if (block.powerUpKind !== PowerUpKind.NO_POWERUP && !block.powerUpSprite) {
          const powerUpBitmap = block.powerUpKind === PowerUpKind.MULTI_BALL
            ? ASSETS.BLOCK_MULTIBALL
            : ASSETS.BLOCK_MULTIPLIER;
          block.powerUpSprite = this.add.sprite(block.x, block.y, powerUpBitmap);
          block.powerUpSprite.setOrigin(0.5, 0.5);
        }
      }

      this.sound.play(ASSETS.SFX_BOUNCE, { volume: 0.25 });
    }
  }

  private spawnPowerUpDrop(x: number, y: number, kind: PowerUpKind): void {
    let bitmap: string;
    if (kind === PowerUpKind.MULTI_BALL) {
      bitmap = ASSETS.DROP_MULTIBALL;
    } else {
      // Use appropriate multiplier sprite based on current multiplier
      const nextMultiplier = Math.min(gameState.scoreMultiplier + 1, 5);
      if (nextMultiplier <= 2) {
        bitmap = ASSETS.DROP_MULTIPLIER;
      } else if (nextMultiplier === 3) {
        bitmap = ASSETS.DROP_MULTIPLIER_3;
      } else if (nextMultiplier === 4) {
        bitmap = ASSETS.DROP_MULTIPLIER_4;
      } else {
        bitmap = ASSETS.DROP_MULTIPLIER_5;
      }
    }

    const sprite = this.add.sprite(x, y, bitmap);
    sprite.setOrigin(0.5, 0.5);

    const drop: PowerUpDropData = {
      x,
      y,
      kind,
      sprite
    };

    gameState.powerUpDrops.push(drop);
  }

  private updatePowerUpDrops(deltaSeconds: number): void {
    const dropsToRemove: number[] = [];

    for (let i = 0; i < gameState.powerUpDrops.length; i++) {
      const drop = gameState.powerUpDrops[i];

      // Fall
      drop.y += POWERUP_FALL_SPEED * deltaSeconds;
      drop.sprite!.y = drop.y;

      // Off screen
      if (drop.y > SCREEN_HEIGHT + 20) {
        dropsToRemove.push(i);
        continue;
      }

      // Paddle catch
      if (this.checkPowerUpCatch(drop)) {
        this.activatePowerUp(drop.kind);
        dropsToRemove.push(i);
      }
    }

    // Remove caught/lost power-ups (in reverse order)
    for (let i = dropsToRemove.length - 1; i >= 0; i--) {
      const idx = dropsToRemove[i];
      gameState.powerUpDrops[idx].sprite?.destroy();
      gameState.powerUpDrops.splice(idx, 1);
    }
  }

  private checkPowerUpCatch(drop: PowerUpDropData): boolean {
    const paddleLeft = gameState.paddleX - PADDLE_WIDTH / 2;
    const paddleRight = gameState.paddleX + PADDLE_WIDTH / 2;
    const paddleTop = PADDLE_Y - PADDLE_HEIGHT / 2;

    return (
      drop.x > paddleLeft &&
      drop.x < paddleRight &&
      drop.y > paddleTop - 10 &&
      drop.y < PADDLE_Y + 10
    );
  }

  private activatePowerUp(kind: PowerUpKind): void {
    this.sound.play(ASSETS.SFX_POWERUP, { volume: 0.5 });

    if (kind === PowerUpKind.MULTI_BALL) {
      gameState.scheduleExtraBall();
    } else if (kind === PowerUpKind.SCORE_MULTIPLY) {
      gameState.increaseMultiplier();
    }
  }

  private updateUI(): void {
    this.scoreText.setText(`Score: ${gameState.score}`);

    // Multiplier display
    if (gameState.scoreMultiplier > 1) {
      this.multiplierText.setText(`x${gameState.scoreMultiplier}`);
      this.multiplierText.setVisible(true);
    } else {
      this.multiplierText.setVisible(false);
    }
  }

  private onLevelComplete(): void {
    if (gameState.currentLevel >= 4) {
      // Game won!
      this.onGameOver(true);
    } else {
      // Next level
      gameState.currentLevel++;
      this.startLevel(gameState.currentLevel);
    }
  }

  private onGameOver(won: boolean): void {
    gameState.gameWon = won;

    if (won) {
      this.sound.play(ASSETS.SFX_WIN);
    }

    // Clean up
    this.clearLevel();

    // Transition to game over scene
    this.scene.start('GameOverScene');
  }
}
