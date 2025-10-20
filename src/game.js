const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const COLORS = {
    player: '#210feb',
    ai: '#ff006e',
    ball: '#00f7ff',
    net: 'rgba(255, 255, 255, 0.3)',
};

const DIMENSIONS = {
    canvasWidth: 800,
    canvasHeight: 600,
    netWidth: 4,
    netHeight: 15,
    netGap: 20,
};

const GAME_CONFIG = {
    winningScore: 5,
    paddleWidth: 15,
    paddleHeight: 100,
    paddleSpeed: 8,
    aiSpeed: 4,
    aiReactionDelay: 0.15,
    aiMistakeChance: 0.08,
};

canvas.width = DIMENSIONS.canvasWidth;
canvas.height = DIMENSIONS.canvasHeight;

const ui = {
    mainMenu: document.getElementById('mainMenu'),
    modeMenu: document.getElementById('modeMenu'),
    gameWrapper: document.getElementById('gameWrapper'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    winnerText: document.getElementById('winnerText'),
    finalScore: document.getElementById('finalScore'),
    playerScore: document.getElementById('playerScore'),
    aiScore: document.getElementById('aiScore'),
    player1Label: document.getElementById('player1Label'),
    player2Label: document.getElementById('player2Label'),
    startBtn: document.getElementById('startBtn'),
    onePlayerBtn: document.getElementById('onePlayerBtn'),
    twoPlayerBtn: document.getElementById('twoPlayerBtn'),
    backBtn: document.getElementById('backBtn'),
    restartBtn: document.getElementById('restartBtn'),
};

const gameState = {
    running: false,
    scores: { player: 0, ai: 0 },
    twoPlayer: false,
    aiTarget: DIMENSIONS.canvasHeight / 2,
    aiReactionTimer: 0,
    ballPaused: false
};

const backgroundImage = new Image();
backgroundImage.src = "assets/PenguinLogo-no-background.png";

const player = {
    x: 30,
    y: DIMENSIONS.canvasHeight / 2 - GAME_CONFIG.paddleHeight / 2,
    width: GAME_CONFIG.paddleWidth,
    height: GAME_CONFIG.paddleHeight,
};

const ai = {
    x: DIMENSIONS.canvasWidth - 30 - GAME_CONFIG.paddleWidth,
    y: DIMENSIONS.canvasHeight / 2 - GAME_CONFIG.paddleHeight / 2,
    width: GAME_CONFIG.paddleWidth,
    height: GAME_CONFIG.paddleHeight,
};

const ball = {
    x: DIMENSIONS.canvasWidth / 2,
    y: DIMENSIONS.canvasHeight / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 3
};

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

backgroundImage.onload = () => {
    console.log("Background loaded!");
};

function setCanvasSize() {
    const maxWidth = Math.min(800, window.innerWidth - 40);
    const maxHeight = Math.min(600, window.innerHeight - 200);
    const scale = Math.min(maxWidth / 800, maxHeight / 600);
    
    canvas.style.width = (800 * scale) + 'px';
    canvas.style.height = (600 * scale) + 'px';
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function withShadow(color, blur, drawFn) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    drawFn();
    ctx.restore();
}

function movePlayer() {
    if (keys['w']) {
        player.y -= GAME_CONFIG.paddleSpeed;
    }
    if (keys['s']) {
        player.y += GAME_CONFIG.paddleSpeed;
    }
    
    player.y = clamp(player.y, 0, DIMENSIONS.canvasHeight - player.height);
}

function moveAI() {
    if (gameState.twoPlayer) {
        if (keys['arrowup']) {
            ai.y -= GAME_CONFIG.paddleSpeed;
        }
        if (keys['arrowdown']) {
            ai.y += GAME_CONFIG.paddleSpeed;
        }
    } else {
        gameState.aiReactionTimer -= 0.016;
        
        if (gameState.aiReactionTimer <= 0) {
            gameState.aiReactionTimer = GAME_CONFIG.aiReactionDelay;
            
            if (Math.random() < GAME_CONFIG.aiMistakeChance) {
                const randomOffset = (Math.random() - 0.5) * 100;
                gameState.aiTarget = ball.y + randomOffset;
            } else {
                gameState.aiTarget = ball.y;
            }
        }
        
        const aiCenter = ai.y + ai.height / 2;
        const deadzone = 20;
        
        if (ball.dx > 0) {
            if (aiCenter < gameState.aiTarget - deadzone) {
                ai.y += GAME_CONFIG.aiSpeed;
            } else if (aiCenter > gameState.aiTarget + deadzone) {
                ai.y -= GAME_CONFIG.aiSpeed;
            }
        } else {
            if (aiCenter < DIMENSIONS.canvasHeight / 2 - deadzone) {
                ai.y += GAME_CONFIG.aiSpeed * 0.5;
            } else if (aiCenter > DIMENSIONS.canvasHeight / 2 + deadzone) {
                ai.y -= GAME_CONFIG.aiSpeed * 0.5;
            }
        }
    }
    
    ai.y = clamp(ai.y, 0, DIMENSIONS.canvasHeight - ai.height);
}

function drawPaddle(paddle, color) {
    withShadow(color, 15, () => {
        ctx.fillStyle = color;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    });
}

function drawBall() {
    withShadow(COLORS.ball, 20, () => {
        ctx.fillStyle = COLORS.ball;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawNet() {
    ctx.fillStyle = COLORS.net;
    for (let i = 0; i < DIMENSIONS.canvasHeight; i += DIMENSIONS.netHeight + DIMENSIONS.netGap) {
        ctx.fillRect(
            DIMENSIONS.canvasWidth / 2 - DIMENSIONS.netWidth / 2,
            i,
            DIMENSIONS.netWidth,
            DIMENSIONS.netHeight
        );
    }
}

function draw() {
    ctx.clearRect(0, 0, DIMENSIONS.canvasWidth, DIMENSIONS.canvasHeight);

    const imgWidth = 200;
    const imgHeight = 200;
    const imgX = (DIMENSIONS.canvasWidth - imgWidth) / 2;
    const imgY = (DIMENSIONS.canvasHeight - imgHeight) / 2;

    ctx.drawImage(backgroundImage, imgX, imgY, imgWidth, imgHeight);

    drawPaddle(player, COLORS.player);
    drawPaddle(ai, COLORS.ai);
    drawBall();
}

function checkPaddleCollision(paddle, isLeftSide) {
    const ballInRange = 
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height;
    
    const ballHitsPaddle = isLeftSide
        ? ball.x - ball.radius < paddle.x + paddle.width && ball.dx < 0
        : ball.x + ball.radius > paddle.x && ball.dx > 0;
    
    if (ballInRange && ballHitsPaddle) {
        const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        ball.dy = hitPos * 5;
        ball.dx = (isLeftSide ? 1 : -1) * Math.abs(ball.dx) * 1.05;
    }
}

function moveBall() {
    if (gameState.ballPaused) return;

    ball.x += ball.dx;
    ball.y += ball.dy;
  
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > DIMENSIONS.canvasHeight) {
        ball.dy *= -1;
    }
    
    checkPaddleCollision(player, true);
    checkPaddleCollision(ai, false);

    if (ball.x - ball.radius < 0) {
        gameState.scores.ai++;
        updateScore();
        pauseAndResetBall(); 
    }
   
    if (ball.x + ball.radius > DIMENSIONS.canvasWidth) {
        gameState.scores.player++;
        updateScore();
        pauseAndResetBall();
    }
    
    if (gameState.scores.player >= GAME_CONFIG.winningScore || 
        gameState.scores.ai >= GAME_CONFIG.winningScore) {
        endGame();
    }
}

function resetBall() {
    ball.x = DIMENSIONS.canvasWidth / 2;
    ball.y = DIMENSIONS.canvasHeight / 2;
    ball.speed = 5;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 6;
}

function updateScore() {
    ui.playerScore.textContent = gameState.scores.player;
    ui.aiScore.textContent = gameState.scores.ai;
}

function updateScoreboardLabels() {
    if (gameState.twoPlayer) {
        ui.player1Label.textContent = 'Player 1';
        ui.player2Label.textContent = 'Player 2';
    } else {
        ui.player1Label.textContent = 'You';
        ui.player2Label.textContent = 'Opponent';
    }
}

function endGame() {
    gameState.running = false;
    
    if (gameState.twoPlayer) {
        ui.winnerText.textContent = gameState.scores.player >= GAME_CONFIG.winningScore 
            ? 'Player 1 Wins!' 
            : 'Player 2 Wins!';
    } else {
        ui.winnerText.textContent = gameState.scores.player >= GAME_CONFIG.winningScore 
            ? 'You Win!' 
            : 'AI Wins!';
    }
    
    ui.finalScore.textContent = `Final Score: ${gameState.scores.player} - ${gameState.scores.ai}`;
    ui.gameOverScreen.classList.remove('hidden');
}

function gameLoop() {
    if (gameState.running) {
        movePlayer(); 
        moveBall();
        moveAI();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    ui.modeMenu.classList.add('hidden');
    ui.gameWrapper.classList.remove('hidden');

    gameState.scores.player = 0;
    gameState.scores.ai = 0;
    gameState.ballPaused = false;
    updateScore();
    updateScoreboardLabels();
    resetBall();
    gameState.running = true;
    gameLoop();
}


function pauseAndResetBall() {
    if (!gameState.running) return
    gameState.ballPaused = true; 
    resetBall();
    draw();
    setTimeout(() => {
        gameState.ballPaused = false;
    }, 1000);
}

ui.startBtn.addEventListener('click', () => {
    ui.mainMenu.classList.add('hidden');
    ui.modeMenu.classList.remove('hidden');
});

ui.onePlayerBtn.addEventListener('click', () => {
    gameState.twoPlayer = false;
    startGame();
});

ui.twoPlayerBtn.addEventListener('click', () => {
    gameState.twoPlayer = true;
    startGame();
});

ui.backBtn.addEventListener('click', () => {
    ui.modeMenu.classList.add('hidden');
    ui.mainMenu.classList.remove('hidden');
});

ui.restartBtn.addEventListener('click', () => {
    ui.gameOverScreen.classList.add('hidden');
    ui.gameWrapper.classList.add('hidden');
    ui.mainMenu.classList.remove('hidden');
    gameState.scores.player = 0;
    gameState.scores.ai = 0;
    updateScore();
});
