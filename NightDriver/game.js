// game.js
import { Road } from './road.js';
import { Controls } from './controls.js';

// --- Constants ---
const ROAD_SAFE_ZONE_DIVISOR = 2.5; // Determines collision boundary (roadWidth / divisor)

// --- Game State (Easily Extensible) ---
const state = {
    playerZ: 0, // Player position down the road
    playerX: 0, // Player horizontal position
    speed: 0,
    maxSpeed: 100,
    acceleration: 2,
    steering: 10,
    gameOver: false,
    score: 0,
    highScore: 0,
    // EXTENSIBILITY: Add fuel, etc.
};

// --- Initialization ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const road = new Road(ctx, canvas.width, canvas.height);
const controls = new Controls();

// Calculate collision boundary once (performance optimization)
const roadEdgeLimit = road.roadWidth / ROAD_SAFE_ZONE_DIVISOR;

// Set up restart callback
controls.onRestart = () => {
    if (state.gameOver) {
        resetGame();
    }
};

// Reset game state
function resetGame() {
    state.playerZ = 0;
    state.playerX = 0;
    state.speed = 0;
    state.gameOver = false;
    state.score = 0;
}

// The main game loop
function loop() {
    // 1. UPDATE LOGIC
    if (!state.gameOver) {
        // Simple acceleration (always accelerating for Night Driver feel)
        state.speed = Math.min(state.maxSpeed, state.speed + state.acceleration / 60);

        // Update Player Z position
        state.playerZ += state.speed;

        // Wrap the track position
        state.playerZ %= (road.segments.length * road.segmentLength); 
        
        // Steering based on controls
        if (controls.isLeft) {
            state.playerX -= state.steering;
        }
        if (controls.isRight) {
            state.playerX += state.steering;
        }
        
        // Collision Detection: Check if player is off the road
        if (Math.abs(state.playerX) > roadEdgeLimit) {
            state.gameOver = true;
            if (state.score > state.highScore) {
                state.highScore = state.score;
            }
        }
        
        // Update score based on distance traveled
        state.score = Math.floor(state.playerZ / 100);
    }
    
    // 2. RENDER LOGIC
    // Clear the canvas for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the sky/horizon
    ctx.fillStyle = '#010111';
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

    // Draw the road using the module
    road.draw(state.playerZ, state.playerX);

    // Draw the simple car graphic (fixed at the bottom)
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / 2 - 40, canvas.height - 80, 80, 60);
    
    // Draw HUD
    ctx.fillStyle = 'white';
    ctx.font = '16px monospace';
    ctx.fillText(`Score: ${state.score}`, 10, 20);
    ctx.fillText(`High Score: ${state.highScore}`, 10, 40);
    ctx.fillText(`Speed: ${Math.floor(state.speed)}`, 10, 60);
    
    // Draw game over screen
    if (state.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.font = '24px monospace';
        ctx.fillText(`Final Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText(`High Score: ${state.highScore}`, canvas.width / 2, canvas.height / 2 + 40);
        
        ctx.font = '20px monospace';
        ctx.fillText('Press SPACE or tap to restart', canvas.width / 2, canvas.height / 2 + 80);
        ctx.textAlign = 'left';
    }

    // Request the next frame
    requestAnimationFrame(loop);
}

// Start the game!
loop();
