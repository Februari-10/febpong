export const COLORS = {
    player: '#210feb',
    ai: '#ff006e',
    ball: '#00f7ff',
    net: 'rgba(255, 255, 255, 0.3)',
};

export const DIMENSIONS = {
    canvasWidth: 800,
    canvasHeight: 600,
    netWidth: 4,
    netHeight: 15,
    netGap: 20,
};

export const GAME_CONFIG = {
    winningScore: 5,
    paddleWidth: 15,
    paddleHeight: 100,
    paddleSpeed: 8,
    aiSpeed: 4,
    aiReactionDelay: 0.15,
    aiMistakeChance: 0.08,
};

export const DIFFICULTY_SETTINGS = {
    easy: {
        aiSpeed: 3,
        aiReactionDelay: 0.25,
        aiMistakeChance: 0.15,
    },
    medium: {
        aiSpeed: 4,
        aiReactionDelay: 0.15,
        aiMistakeChance: 0.08,
    },
    hard: {
        aiSpeed: 5.5,
        aiReactionDelay: 0.08,
        aiMistakeChance: 0.02,
    }
};