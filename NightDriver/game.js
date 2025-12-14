// game.js
import { Road } from './road.js';
import { Controls } from './controls.js';

// --- Game State (Easily Extensible) ---
const state = {
    playerZ: 0, // Player position down the road
    playerX: 0, // Player horizontal position
    speed: 0,
    maxSpeed: 100,
    acceleration: 2,
    steering: 10,
    // EXTENSIBILITY: Add score, highscore, fuel, etc.
};

// --- Initialization ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const road = new Road(ctx, canvas.width, canvas.height);
const controls = new Controls();

// The main game loop
function loop() {
    // 1. UPDATE LOGIC
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
    
    // EXTENSIBILITY: Add Collision Detection, Speed limits, etc.
    
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
    ctx.fillStyle = 'white';
    ctx.fillText(`Z: ${Math.floor(state.playerZ)}`, 10, 20);


    // Request the next frame
    requestAnimationFrame(loop);
}

// Start the game!
loop();
