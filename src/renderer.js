import { COLORS, DIMENSIONS } from './config.js';
import { player, ai, ball } from './entities.js';

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

canvas.width = DIMENSIONS.canvasWidth;
canvas.height = DIMENSIONS.canvasHeight;

export const backgroundImage = new Image();
backgroundImage.src = "assets/PenguinLogo-no-background.png";

backgroundImage.onload = () => {
    console.log("Background loaded!");
};

export function setCanvasSize() {
    const maxWidth = Math.min(800, window.innerWidth - 40);
    const maxHeight = Math.min(600, window.innerHeight - 200);
    const scale = Math.min(maxWidth / 800, maxHeight / 600);
    
    canvas.style.width = (800 * scale) + 'px';
    canvas.style.height = (600 * scale) + 'px';
}

function withShadow(color, blur, drawFn) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    drawFn();
    ctx.restore();
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

export function draw() {
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