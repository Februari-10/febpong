import { DIMENSIONS, GAME_CONFIG } from './config.js';

export const player = {
    x: 30,
    y: DIMENSIONS.canvasHeight / 2 - GAME_CONFIG.paddleHeight / 2,
    width: GAME_CONFIG.paddleWidth,
    height: GAME_CONFIG.paddleHeight,
};

export const ai = {
    x: DIMENSIONS.canvasWidth - 30 - GAME_CONFIG.paddleWidth,
    y: DIMENSIONS.canvasHeight / 2 - GAME_CONFIG.paddleHeight / 2,
    width: GAME_CONFIG.paddleWidth,
    height: GAME_CONFIG.paddleHeight,
};

export const ball = {
    x: DIMENSIONS.canvasWidth / 2,
    y: DIMENSIONS.canvasHeight / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 3
};

export function resetBall() {
    ball.x = DIMENSIONS.canvasWidth / 2;
    ball.y = DIMENSIONS.canvasHeight / 2;
    ball.speed = 5;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 6;
}