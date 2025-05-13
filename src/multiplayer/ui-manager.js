import { Translator } from '../utils/translator.js';

/**
 * UI Manager for the multiplayer game
 */
export class MultiplayerUIManager {
  /**
   * Create a new UI manager
   * @param {MultiplayerGame} game - The game instance
   */
  constructor(game) {
    this.game = game;
    this.translator = new Translator();
    
    // UI elements cache
    this.elements = {};
    
    // Bind event handlers
    this.bindCreateRoomEvents = this.bindCreateRoomEvents.bind(this);
    this.bindJoinRoomEvents = this.bindJoinRoomEvents.bind(this);
    this.bindWaitingRoomEvents = this.bindWaitingRoomEvents.bind(this);
    this.bindGameEvents = this.bindGameEvents.bind(this);
  }

  /**
   * Initialize the UI manager
   */
  init() {
    // Cache UI elements
    this.cacheElements();
    
    // Bind menu events
    this.bindMenuEvents();
  }

  /**
   * Cache DOM elements for quick access
   */
  cacheElements() {
    // Menu elements
    this.elements.multiplayerMenu = document.getElementById('multiplayer-menu');
    this.elements.createRoomBtn = document.getElementById('create-room-btn');
    this.elements.joinRoomBtn = document.getElementById('join-room-btn');
    
    // Create room form elements
    this.elements.createRoomForm = document.getElementById('create-room-form');
    this.elements.createRoomFormElement = document.getElementById('create-room-form-element');
    this.elements.playerName = document.getElementById('player-name');
    this.elements.maxPlayers = document.getElementById('max-players');
    this.elements.controlInputs = {
      up: document.getElementById('control-up'),
      right: document.getElementById('control-right'),
      down: document.getElementById('control-down'),
      left: document.getElementById('control-left'),
      confirm: document.getElementById('control-confirm')
    };
    this.elements.customizeControlsBtn = document.getElementById('customize-controls-btn');
    this.elements.cancelCreateBtn = this.elements.createRoomForm.querySelector('.cancel-btn');
    
    // Join room form elements
    this.elements.joinRoomForm = document.getElementById('join-room-form');
    this.elements.joinRoomFormElement = document.getElementById('join-room-form-element');
    this.elements.joinPlayerName = document.getElementById('join-player-name');
    this.elements.roomCode = document.getElementById('room-code');
    this.elements.joinControlInputs = {
      up: document.getElementById('join-control-up'),
      right: document.getElementById('join-control-right'),
      down: document.getElementById('join-control-down'),
      left: document.getElementById('join-control-left'),
      confirm: document.getElementById('join-control-confirm')
    };
    this.elements.joinCustomizeControlsBtn = document.getElementById('join-customize-controls-btn');
    this.elements.cancelJoinBtn = this.elements.joinRoomForm.querySelector('.cancel-btn');
    
    // Waiting room elements
    this.elements.waitingRoom = document.getElementById('waiting-room');
    this.elements.displayRoomCode = document.getElementById('display-room-code');
    this.elements.playerCount = document.getElementById('player-count');
    this.elements.playersList = document.getElementById('players-list');
    this.elements.readyBtn = document.getElementById('ready-btn');
    this.elements.leaveRoomBtn = document.getElementById('leave-room-btn');
    this.elements.copyRoomCodeBtn = document.getElementById('copy-room-code');
    
    // Game elements
    this.elements.gameSection = document.getElementById('numbers');
    this.elements.numbersHead = document.getElementById('numbers-head');
    this.elements.currentTarget = document.getElementById('current-target');
    this.elements.numbersParent = document.getElementById('numbers-parent');
    this.elements.pauseCover = document.getElementById('pause-cover');
    this.elements.resumeBtn = document.getElementById('resume-btn');
    this.elements.exitGameBtn = document.getElementById('exit-game-btn');
    
    // Game over elements
    this.elements.gameOver = document.getElementById('game-over');
    this.elements.multiplayerResults = document.getElementById('multiplayer-results');
    this.elements.playAgainBtn = document.getElementById('play-again-btn');
    this.elements.returnToMenuBtn = document.getElementById('return-to-menu-btn');
    
    // Toast element
    this.elements.toast = document.getElementById('toast');
  }

  /**
   * Bind menu event handlers
   */
  bindMenuEvents() {
    // Create room button
    this.elements.createRoomBtn.addEventListener('click', () => {
      this.showCreateRoomForm();
    });
    
    // Join room button
    this.elements.joinRoomBtn.addEventListener('click', () => {
      this.showJoinRoomForm();
    });
    
    // Bind form events
    this.bindCreateRoomEvents();
    this.bindJoinRoomEvents();
    
    // Bind waiting room events
    this.bindWaitingRoomEvents();
    
    // Bind game events
    this.bindGameEvents();
  }

  /**
   * Bind create room form events
   */
  bindCreateRoomEvents() {
    // Form submission
    this.elements.createRoomFormElement.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Gather form data
      const playerName = this.elements.playerName.value.trim();
      const maxPlayers = parseInt(this.elements.maxPlayers.value);
      
      // Get controls
      const controls = {
        up: this.elements.controlInputs.up.value,
        right: this.elements.controlInputs.right.value,
        down: this.elements.controlInputs.down.value,
        left: this.elements.controlInputs.left.value,
        confirm: this.elements.controlInputs.confirm.value
      };
      
      // Create the room
      this.game.createRoom({
        playerName,
        maxPlayers,
        controls
      });
      
      // Hide the form
      this.elements.createRoomForm.style.display = 'none';
    });
    
    // Cancel button
    this.elements.cancelCreateBtn.addEventListener('click', () => {
      this.elements.createRoomForm.style.display = 'none';
    });
    
    // Customize controls button
    this.elements.customizeControlsBtn.addEventListener('click', () => {
      this.startControlCustomization(this.elements.controlInputs);
    });
  }

  /**
   * Bind join room form events
   */
  bindJoinRoomEvents() {
    // Form submission
    this.elements.joinRoomFormElement.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Gather form data
      const playerName = this.elements.joinPlayerName.value.trim();
      const roomCode = this.elements.roomCode.value.trim().toUpperCase();
      
      // Get controls
      const controls = {
        up: this.elements.joinControlInputs.up.value,
        right: this.elements.joinControlInputs.right.value,
        down: this.elements.joinControlInputs.down.value,
        left: this.elements.joinControlInputs.left.value,
        confirm: this.elements.joinControlInputs.confirm.value
      };
      
      // Join the room
      this.game.joinRoom({
        roomCode,
        playerName,
        controls
      });
      
      // Hide the form
      this.elements.joinRoomForm.style.display = 'none';
    });
    
    // Cancel button
    this.elements.cancelJoinBtn.addEventListener('click', () => {
      this.elements.joinRoomForm.style.display = 'none';
    });
    
    // Customize controls button
    this.elements.joinCustomizeControlsBtn.addEventListener('click', () => {
      this.startControlCustomization(this.elements.joinControlInputs);
    });
  }

  /**
   * Bind waiting room events
   */
  bindWaitingRoomEvents() {
    // Ready button
    this.elements.readyBtn.addEventListener('click', () => {
      const isReady = !this.game.isReady;
      this.game.setReady(isReady);
      
      // Update button text
      this.elements.readyBtn.textContent = isReady ? 'Not Ready' : 'Ready';
      this.elements.readyBtn.classList.toggle('primary-btn', !isReady);
      this.elements.readyBtn.classList.toggle('cancel-btn', isReady);
    });
    
    // Leave room button
    this.elements.leaveRoomBtn.addEventListener('click', () => {
      this.game.leaveRoom();
    });
    
    // Copy room code button
    this.elements.copyRoomCodeBtn.addEventListener('click', () => {
      const roomCode = this.elements.displayRoomCode.textContent;
      navigator.clipboard.writeText(roomCode)
        .then(() => {
          this.showToast('Room code copied to clipboard', 'success');
        })
        .catch(() => {
          this.showToast('Failed to copy room code', 'error');
        });
    });
  }

  /**
   * Bind game events
   */
  bindGameEvents() {
    // Resume button
    this.elements.resumeBtn.addEventListener('click', () => {
      this.elements.pauseCover.style.display = 'none';
    });
    
    // Exit game button
    this.elements.exitGameBtn.addEventListener('click', () => {
      this.game.reset();
    });
    
    // Play again button
    this.elements.playAgainBtn.addEventListener('click', () => {
      this.game.reset();
    });
    
    // Return to menu button
    this.elements.returnToMenuBtn.addEventListener('click', () => {
      this.game.reset();
    });
    
    // Pause key
    document.addEventListener('keyup', (event) => {
      if (event.code === 'Escape' && this.game.gameRunning) {
        this.elements.pauseCover.style.display = 
          this.elements.pauseCover.style.display === 'none' ? 'flex' : 'none';
      }
    });
  }

  /**
   * Start control customization for a set of control inputs
   * @param {object} controlInputs - The control input elements
   */
  startControlCustomization(controlInputs) {
    // Current control being customized
    let currentControl = null;
    
    // Function to start customizing a control
    const startCustomizing = (inputElement, controlName) => {
      currentControl = { element: inputElement, name: controlName };
      inputElement.value = 'Press a key...';
      inputElement.classList.add('customizing');
    };
    
    // Function to handle key press for customization
    const handleKeyPress = (event) => {
      event.preventDefault();
      
      if (!currentControl) return;
      
      currentControl.element.value = event.code;
      currentControl.element.classList.remove('customizing');
      
      // Remove the key press listener
      document.removeEventListener('keydown', handleKeyPress);
      
      currentControl = null;
    };
    
    // Add click listeners to each control input
    Object.entries(controlInputs).forEach(([controlName, inputElement]) => {
      inputElement.addEventListener('click', () => {
        // Remove readonly attribute
        inputElement.removeAttribute('readonly');
        
        // Start customizing
        startCustomizing(inputElement, controlName);
        
        // Add key press listener
        document.addEventListener('keydown', handleKeyPress);
      });
    });
  }

  /**
   * Show the create room form
   */
  showCreateRoomForm() {
    // Verify socket connection first
    if (!this.game.socket || this.game.socket.readyState !== WebSocket.OPEN) {
      this.showToast('Not connected to server. Please refresh the page.', 'error');
      return;
    }
    
    this.elements.createRoomForm.style.display = 'flex';
  }

  /**
   * Show the join room form
   */
  showJoinRoomForm() {
    // Verify socket connection first
    if (!this.game.socket || this.game.socket.readyState !== WebSocket.OPEN) {
      this.showToast('Not connected to server. Please refresh the page.', 'error');
      return;
    }
    
    this.elements.joinRoomForm.style.display = 'flex';
  }

  /**
   * Show the waiting room
   * @param {object} room - Room data
   */
  showWaitingRoom(room) {
    // Hide menu
    this.elements.multiplayerMenu.style.display = 'none';
    
    // Update room info
    this.elements.displayRoomCode.textContent = room.id;
    this.elements.playerCount.textContent = `${room.players.length}/${room.maxPlayers}`;
    
    // Render players list
    this.renderPlayersList(room);
    
    // Show waiting room
    this.elements.waitingRoom.style.display = 'block';
  }

  /**
   * Update the waiting room UI
   * @param {object} room - Updated room data
   */
  updateWaitingRoom(room) {
    // Update player count
    this.elements.playerCount.textContent = `${room.players.length}/${room.maxPlayers}`;
    
    // Re-render players list
    this.renderPlayersList(room);
  }

  /**
   * Render the players list in the waiting room
   * @param {object} room - Room data
   */
  renderPlayersList(room) {
    // Clear existing players
    this.elements.playersList.innerHTML = '';
    
    // Add each player
    room.players.forEach(player => {
      const isCurrentPlayer = player.id === this.game.playerId;
      const isHost = player.id === room.host;
      
      const playerCard = document.createElement('div');
      playerCard.className = `player-card ${isHost ? 'host' : ''}`;
      
      // Player avatar (first letter of name in a circle with player color)
      const playerAvatar = document.createElement('div');
      playerAvatar.className = 'player-avatar';
      playerAvatar.style.backgroundColor = player.color;
      playerAvatar.textContent = player.name.charAt(0).toUpperCase();
      
      // Player name
      const playerName = document.createElement('div');
      playerName.className = 'player-name';
      playerName.textContent = `${player.name}${isCurrentPlayer ? ' (You)' : ''}${isHost ? ' (Host)' : ''}`;
      
      // Player status
      const playerStatus = document.createElement('div');
      playerStatus.className = `player-status ${player.isReady ? 'status-ready' : 'status-waiting'}`;
      playerStatus.textContent = player.isReady ? 'Ready' : 'Waiting';
      
      // Add elements to card
      playerCard.appendChild(playerAvatar);
      playerCard.appendChild(playerName);
      playerCard.appendChild(playerStatus);
      
      // Add card to list
      this.elements.playersList.appendChild(playerCard);
    });
  }

  /**
   * Show the game countdown
   */
  showGameCountdown() {
    // Create countdown overlay
    const countdownOverlay = document.createElement('div');
    countdownOverlay.className = 'countdown-overlay';
    countdownOverlay.style.position = 'fixed';
    countdownOverlay.style.top = '0';
    countdownOverlay.style.left = '0';
    countdownOverlay.style.width = '100%';
    countdownOverlay.style.height = '100%';
    countdownOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    countdownOverlay.style.display = 'flex';
    countdownOverlay.style.justifyContent = 'center';
    countdownOverlay.style.alignItems = 'center';
    countdownOverlay.style.zIndex = '1000';
    
    // Countdown number
    const countdownNumber = document.createElement('div');
    countdownNumber.className = 'countdown-number';
    countdownNumber.style.fontSize = '10rem';
    countdownNumber.style.color = 'white';
    countdownNumber.textContent = '3';
    
    countdownOverlay.appendChild(countdownNumber);
    document.body.appendChild(countdownOverlay);
    
    // Start countdown
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      
      if (count > 0) {
        countdownNumber.textContent = count.toString();
      } else if (count === 0) {
        countdownNumber.textContent = 'Go!';
      } else {
        clearInterval(countdownInterval);
        document.body.removeChild(countdownOverlay);
      }
    }, 1000);
  }

  /**
   * Show the game screen
   * @param {array} players - Array of players
   * @param {number} currentTarget - Current target number
   */
  showGameScreen(players, currentTarget) {
    // Hide waiting room
    this.elements.waitingRoom.style.display = 'none';
    
    // Setup the scores display in the header
    this.setupScoresDisplay(players);
    
    // Update target display
    this.updateTarget(currentTarget);
    
    // Show game section
    this.elements.gameSection.style.display = 'block';
  }

  /**
   * Setup the scores display in the game header
   * @param {array} players - Array of players
   */
  setupScoresDisplay(players) {
    // Clear existing player displays
    const targetContainer = this.elements.numbersHead.querySelector('div');
    
    // Remove existing elements before the target container
    while (this.elements.numbersHead.firstChild !== targetContainer) {
      this.elements.numbersHead.removeChild(this.elements.numbersHead.firstChild);
    }
    
    // Remove existing elements after the target container
    while (this.elements.numbersHead.lastChild !== targetContainer) {
      this.elements.numbersHead.removeChild(this.elements.numbersHead.lastChild);
    }
    
    // Add player score displays
    players.forEach(player => {
      const scoreElement = document.createElement('div');
      scoreElement.className = 'player-score';
      scoreElement.id = `player-score-${player.id}`;
      
      // Color indicator
      const indicator = document.createElement('span');
      indicator.className = 'player-indicator';
      indicator.style.backgroundColor = player.color;
      
      // Player name (truncated if needed)
      const nameElement = document.createElement('span');
      nameElement.className = 'player-score-name';
      nameElement.textContent = player.name;
      
      // Score
      const scoreValue = document.createElement('span');
      scoreValue.className = 'player-score-value';
      scoreValue.textContent = '0';
      
      // Add elements to score container
      scoreElement.appendChild(indicator);
      scoreElement.appendChild(nameElement);
      scoreElement.appendChild(scoreValue);
      
      // Add to appropriate position in header
      if (players.indexOf(player) < Math.floor(players.length / 2)) {
        // Add before the target
        this.elements.numbersHead.insertBefore(scoreElement, targetContainer);
      } else {
        // Add after the target
        this.elements.numbersHead.appendChild(scoreElement);
      }
    });
  }

  /**
   * Update the target display
   * @param {number} target - The new target number
   */
  updateTarget(target) {
    // Update the target number
    this.elements.currentTarget.className = target.toString();
    
    // Translate the number based on selected language
    const language = this.game.settings.get('language');
    const translatedWord = this.translator.translateNumber(target, language);
    this.elements.currentTarget.textContent = translatedWord;
  }

  /**
   * Show the game over screen
   * @param {array} players - Array of players with final scores
   */
  showGameOver(players) {
    // Sort players by score (highest first)
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    // Clear existing results
    this.elements.multiplayerResults.innerHTML = '';
    
    // Add each player's result
    sortedPlayers.forEach((player, index) => {
      const resultRow = document.createElement('div');
      resultRow.className = 'result-row';
      
      // Position
      const position = document.createElement('div');
      position.className = 'result-position';
      position.textContent = `#${index + 1}`;
      
      // Player info
      const playerInfo = document.createElement('div');
      playerInfo.className = 'result-player';
      
      // Color indicator
      const indicator = document.createElement('span');
      indicator.className = 'player-indicator';
      indicator.style.backgroundColor = player.color;
      
      // Player name
      const playerName = document.createElement('span');
      playerName.textContent = player.name;
      
      playerInfo.appendChild(indicator);
      playerInfo.appendChild(playerName);
      
      // Score
      const score = document.createElement('div');
      score.className = 'result-score';
      score.textContent = player.score;
      
      // Add elements to row
      resultRow.appendChild(position);
      resultRow.appendChild(playerInfo);
      resultRow.appendChild(score);
      
      // Add row to results
      this.elements.multiplayerResults.appendChild(resultRow);
    });
    
    // Show game over screen
    this.elements.gameOver.style.display = 'block';
  }

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Notification type (success, error, etc.)
   */
  showToast(message, type = '') {
    // Set toast message and type
    this.elements.toast.textContent = message;
    this.elements.toast.className = 'toast';
    
    if (type) {
      this.elements.toast.classList.add(type);
    }
    
    // Show the toast
    this.elements.toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
      this.elements.toast.classList.remove('show');
    }, 3000);
  }
} 