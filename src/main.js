import { Game } from './utils/game.js';
import './styles/index.css';

/**
 * Shaka Game - A multiplayer number finding game
 * 
 * Refactored with a modular, object-oriented approach for better:
 * - Code organization
 * - Maintainability
 * - Extensibility
 * - Reusability
 */

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize the game
  const game = new Game();
  game.init();
  
  // Expose the game to the global scope for debugging purposes
  window.shakaGame = game;
}); 