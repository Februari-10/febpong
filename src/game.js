import { DIMENSIONS, GAME_CONFIG } from './config.js';
import { player, ai, ball, resetBall } from './entities.js';
import { draw } from './renderer.js';

export const gameState = {
    running: false,
    scores: { player: 0, ai: 0 },
    twoPlayer: false,
    aiTarget: DIMENSIONS.canvasHeight / 2,
    aiReactionTimer: 0,
    ballPaused: false
};

export const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

export function movePlayer() {
    if (keys['w'] || keys['arrowup']) {
        player.y -= GAME_CONFIG.paddleSpeed;
    }
    if (keys['s'] || keys['arrowdown']) {
        player.y += GAME_CONFIG.paddleSpeed;
    }
    
    player.y = clamp(player.y, 0, DIMENSIONS.canvasHeight - player.height);
}

export function moveAI() {
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

export function moveBall(updateScore, endGame) {
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

export function pauseAndResetBall() {
    if (!gameState.running) return;
    gameState.ballPaused = true; 
    resetBall();
    draw();
    setTimeout(() => {
        gameState.ballPaused = false;
    }, 1000);
}

export function gameLoop(updateScore, endGame) {
    if (gameState.running) {
        movePlayer(); 
        moveBall(updateScore, endGame);
        moveAI();
        draw();
        requestAnimationFrame(() => gameLoop(updateScore, endGame));
    }
}