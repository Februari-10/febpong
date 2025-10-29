import { GAME_CONFIG } from './config.js';
import { gameState, gameLoop } from './game.js';
import { resetBall } from './entities.js';

export const ui = {
    mainMenu: document.getElementById('mainMenu'),
    modeMenu: document.getElementById('modeMenu'),
    difficultyMenu: document.getElementById('difficultyMenu'),
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
    backFromDifficultyBtn: document.getElementById('backFromDifficultyBtn'),
    easyBtn: document.getElementById('easyBtn'),
    mediumBtn: document.getElementById('mediumBtn'),
    hardBtn: document.getElementById('hardBtn'),
    restartBtn: document.getElementById('restartBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
};

export function updateScore() {
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

export function endGame() {
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

function startGame() {
    ui.difficultyMenu.classList.add('hidden');
    ui.modeMenu.classList.add('hidden');
    ui.gameWrapper.classList.remove('hidden');

    gameState.scores.player = 0;
    gameState.scores.ai = 0;
    gameState.ballPaused = false;
    updateScore();
    updateScoreboardLabels();
    resetBall();
    gameState.running = true;
    gameLoop(updateScore, endGame);
}

export function setupEventListeners() {
    console.log('Setting up event listeners...');
    console.log('difficultyMenu element:', ui.difficultyMenu);
    console.log('playAgainBtn element:', ui.playAgainBtn);
    
    ui.startBtn.addEventListener('click', () => {
        ui.mainMenu.classList.add('hidden');
        ui.modeMenu.classList.remove('hidden');
    });

    ui.onePlayerBtn.addEventListener('click', () => {
        console.log('1 Player clicked, showing difficulty menu');
        gameState.twoPlayer = false;
        ui.modeMenu.classList.add('hidden');
        ui.difficultyMenu.classList.remove('hidden');
        console.log('difficultyMenu classes:', ui.difficultyMenu.className);
    });

    ui.twoPlayerBtn.addEventListener('click', () => {
        gameState.twoPlayer = true;
        startGame();
    });

    ui.easyBtn.addEventListener('click', () => {
        gameState.difficulty = 'easy';
        startGame();
    });

    ui.mediumBtn.addEventListener('click', () => {
        gameState.difficulty = 'medium';
        startGame();
    });

    ui.hardBtn.addEventListener('click', () => {
        gameState.difficulty = 'hard';
        startGame();
    });

    ui.backBtn.addEventListener('click', () => {
        ui.modeMenu.classList.add('hidden');
        ui.mainMenu.classList.remove('hidden');
    });

    ui.backFromDifficultyBtn.addEventListener('click', () => {
        ui.difficultyMenu.classList.add('hidden');
        ui.modeMenu.classList.remove('hidden');
    });

    ui.restartBtn.addEventListener('click', () => {
        ui.gameOverScreen.classList.add('hidden');
        ui.gameWrapper.classList.add('hidden');
        ui.mainMenu.classList.remove('hidden');
        gameState.scores.player = 0;
        gameState.scores.ai = 0;
        updateScore();
    });

    ui.playAgainBtn.addEventListener('click', () => {
        ui.gameOverScreen.classList.add('hidden');
        gameState.scores.player = 0;
        gameState.scores.ai = 0;
        gameState.ballPaused = false;
        updateScore();
        resetBall();
        gameState.running = true;
        gameLoop(updateScore, endGame);
    });
}