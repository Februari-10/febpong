import { setCanvasSize } from './src/renderer.js';
import { setupEventListeners } from './src/ui.js';

console.log('Main.js loaded');

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

setupEventListeners();

console.log('Event listeners setup complete');