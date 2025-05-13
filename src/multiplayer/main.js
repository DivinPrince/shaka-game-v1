import { MultiplayerGame } from './game.js';

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing multiplayer game...');
  
  // Show loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loading-indicator';
  loadingIndicator.textContent = 'Connecting to server...';
  loadingIndicator.style.position = 'fixed';
  loadingIndicator.style.top = '20px';
  loadingIndicator.style.left = '50%';
  loadingIndicator.style.transform = 'translateX(-50%)';
  loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
  loadingIndicator.style.color = 'white';
  loadingIndicator.style.padding = '10px 20px';
  loadingIndicator.style.borderRadius = '5px';
  loadingIndicator.style.zIndex = '9999';
  document.body.appendChild(loadingIndicator);
  
  // Create the multiplayer game instance
  const game = new MultiplayerGame();
  
  // Initialize the game
  game.init();
  
  // Hide loading indicator after a delay
  setTimeout(() => {
    if (document.body.contains(loadingIndicator)) {
      document.body.removeChild(loadingIndicator);
    }
  }, 1500);
  
  // Make the game available globally for debugging
  window.multiplayerGame = game;
});