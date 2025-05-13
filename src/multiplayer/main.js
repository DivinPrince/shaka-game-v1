import { MultiplayerGame } from './game.js';

/**
 * Dynamically load the Socket.io client script
 * @param {string} serverUrl - Server URL
 * @returns {Promise} - Promise that resolves when the script is loaded
 */
function loadSocketIoScript(serverUrl = 'http://localhost:3000') {
  return new Promise((resolve, reject) => {
    // Check if Socket.io is already loaded
    if (typeof io !== 'undefined') {
      console.log('Socket.io is already loaded');
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://shaka-game-multiplayer-server.onrender.com/socket.io/socket.io.js`;
    script.async = true;
    
    script.onload = () => {
      console.log('Socket.io client script loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      const error = new Error('Failed to load Socket.io client script');
      console.error(error);
      reject(error);
    };
    
    document.head.appendChild(script);
  });
}

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
  
  // Try to load Socket.io client
  try {
    await loadSocketIoScript();
  } catch (error) {
    console.error('Error loading Socket.io:', error);
    loadingIndicator.textContent = 'Error connecting to server';
    loadingIndicator.style.backgroundColor = 'rgba(255,0,0,0.7)';
    
    // Show connection error
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
      statusElement.classList.remove('connecting');
      statusElement.classList.add('disconnected');
      
      const textElement = statusElement.querySelector('.status-text');
      if (textElement) {
        textElement.textContent = 'Connection Failed';
      }
    }
    
    // Still create the game with reduced functionality
    setTimeout(() => {
      document.body.removeChild(loadingIndicator);
    }, 2000);
  }
  
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