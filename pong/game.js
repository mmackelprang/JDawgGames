// --- 1. SETUP AND CONSTANTS ---
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_MOVEMENT = 15;
const WINNING_SCORE = 10;
const INITIAL_BALL_SPEED = 5;

// Initial state
let player1Y, player2Y, ballX, ballY, ballSpeedX, ballSpeedY;
let player1Score = 0;
let player2Score = 0;
let gamePaused = true;
let winningMessage = "";

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    winningMessage = "";
    resetBall();
    gamePaused = false;
}

function resetBall(servingPlayer = 1) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    
    // Serve direction based on who scored last
    ballSpeedX = servingPlayer === 1 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED;
    
    // Random initial vertical speed (between -3 and 3)
    ballSpeedY = (Math.random() * 6) - 3;
    
    player1Y = (canvas.height - PADDLE_HEIGHT) / 2;
    player2Y = (canvas.height - PADDLE_HEIGHT) / 2;
}

// --- 2. GAME LOOP ---
function gameLoop() {
    if (!gamePaused) {
        update();
    }
    draw();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
resetGame(); // Start the game on load

// --- 3. DRAWING ---
function draw() {
    // 1. Draw the court (black background)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw the dividing line and scores
    ctx.strokeStyle = '#00ff44';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.fillStyle = '#00ff44';
    ctx.font = '40px "Courier New", monospace';
    ctx.fillText(player1Score, canvas.width / 4 - 20, 50);
    ctx.fillText(player2Score, canvas.width * 3 / 4 + 10, 50);

    // 3. Draw Paddles
    ctx.fillRect(0, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // 4. Draw Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 5. Display winning message
    if (winningMessage) {
        ctx.textAlign = 'center';
        ctx.font = '50px "Courier New", monospace';
        ctx.fillText(winningMessage, canvas.width / 2, canvas.height / 2);
        ctx.font = '20px "Courier New", monospace';
        ctx.fillText("Press SPACE to restart", canvas.width / 2, canvas.height / 2 + 40);
        ctx.textAlign = 'left';
    }
}

// --- 4. UPDATING (GAME LOGIC) ---
function update() {
    // A. Ball Movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // B. Top/Bottom Wall Collision
    if (ballY - BALL_SIZE / 2 < 0 || ballY + BALL_SIZE / 2 > canvas.height) {
        ballSpeedY = -ballSpeedY; // Reverse vertical direction
    }

    // C. Paddle Collision Logic
    if (ballSpeedX < 0) { // Ball moving left (Player 1 side)
        if (ballX - BALL_SIZE / 2 < PADDLE_WIDTH && 
            ballY > player1Y && 
            ballY < player1Y + PADDLE_HEIGHT) {
            
            ballSpeedX = -ballSpeedX;
            // Calculate impact point relative to paddle center (-1 at top, 1 at bottom)
            let deltaY = ballY - (player1Y + PADDLE_HEIGHT / 2);
            // Adjust vertical speed based on impact point (max 7)
            ballSpeedY = deltaY * 0.1; 
        }
    } else { // Ball moving right (Player 2 side)
        if (ballX + BALL_SIZE / 2 > canvas.width - PADDLE_WIDTH &&
            ballY > player2Y &&
            ballY < player2Y + PADDLE_HEIGHT) {
            
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (player2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.1;
        }
    }

    // D. Scoring (Missed Ball) and Win Condition
    if (ballX < 0) { // Player 2 scores
        player2Score++;
        checkWinCondition();
        if (!gamePaused) resetBall(2);
    } else if (ballX > canvas.width) { // Player 1 scores
        player1Score++;
        checkWinCondition();
        if (!gamePaused) resetBall(1);
    }
}

function checkWinCondition() {
    if (player1Score >= WINNING_SCORE) {
        winningMessage = "Player 1 Wins!";
        gamePaused = true;
    } else if (player2Score >= WINNING_SCORE) {
        winningMessage = "Player 2 Wins!";
        gamePaused = true;
    }
}

// --- 5. USER INPUT (TWO PLAYER CONTROLS) ---
document.addEventListener('keydown', (event) => {
    // Player 1 controls (W/S)
    if (event.key === 'w' || event.key === 'W') {
        player1Y = Math.max(0, player1Y - PADDLE_MOVEMENT);
    } else if (event.key === 's' || event.key === 'S') {
        player1Y = Math.min(canvas.height - PADDLE_HEIGHT, player1Y + PADDLE_MOVEMENT);
    }
    
    // Player 2 controls (Arrow Keys)
    if (event.key === 'ArrowUp') {
        player2Y = Math.max(0, player2Y - PADDLE_MOVEMENT);
    } else if (event.key === 'ArrowDown') {
        player2Y = Math.min(canvas.height - PADDLE_HEIGHT, player2Y + PADDLE_MOVEMENT);
    }
    
    // Restart Game
    if (gamePaused && event.key === ' ') {
        resetGame();
    }
});
