import { Settings } from '../../src/utils/settings.js';
import { Translator } from '../../src/utils/translator.js';
import { MultiplayerBoard } from './board.js';
import { MultiplayerPlayer } from './player.js';
import { MultiplayerUIManager } from './ui-manager.js';

/**
 * Multiplayer Game class
 */
export class MultiplayerGame {
  /**
   * Create a new multiplayer game instance
   */
  constructor() {
    // Initialize game components
    this.settings = new Settings();
    this.translator = new Translator();
    this.board = new MultiplayerBoard();
    
    // UI manager will be set in init
    this.ui = null;
    
    // Game state
    this.players = [];
    this.currentTarget = 1;
    this.gameRunning = false;
    this.countdownIndex = 0;
    
    // Socket.io connection
    this.socket = null;
    this.socketConnected = false;
    
    // Player information
    this.playerId = null;
    this.roomCode = null;
    this.isHost = false;
    this.isReady = false;
    
    // Countdown levels
    this.levels = [3, 2, 1, 'Go!'];
    
    // Bind methods
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleSocketEvents = this.handleSocketEvents.bind(this);
  }

  /**
   * Initialize the multiplayer game
   */
  init() {
    // Initialize settings
    this.settings.init();
    
    // Initialize Socket.io connection - do this first
    this.initializeSocket();
    
    // Initialize UI after socket connection attempt
    setTimeout(() => {
      // Create UI manager
      this.ui = new MultiplayerUIManager(this);
      this.ui.init();
    }, 800);
  }

  /**
   * Initialize Socket.io connection
   */
  initializeSocket() {
    try {
      // Check if io is defined
      if (typeof io === 'undefined') {
        console.error('Socket.io client is not loaded');
        this.updateConnectionStatus('disconnected', 'Socket.io Not Available');
        
        // Create a notification that will display after UI is initialized
        setTimeout(() => {
          if (this.ui) {
            this.ui.showToast('Socket.io not available. Please check server connection.', 'error');
          }
        }, 1000);
        
        return;
      }
      
      const isDevEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      // Create socket connection with explicit configuration
      const serverUrl = isDevEnvironment ? 'http://localhost:3000' : 'https://shaka-game-multiplayer-server.onrender.com';
      console.log('Attempting to connect to Socket.io server at:', serverUrl);
      
      this.socket = io(serverUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000, // Increase timeout to 20 seconds for slower connections
        transports: ['websocket', 'polling'],
        withCredentials: false,
        forceNew: true
      });
      
      // Set up socket event handlers
      this.handleSocketEvents();
      
      // Add a connection timeout - increased to accommodate slow rendered servers
      this.connectionTimeout = setTimeout(() => {
        if (!this.socketConnected) {
          console.error('Socket connection timeout');
          this.updateConnectionStatus('disconnected', 'Connection Timeout');
          
          // Show error if UI is initialized
          if (this.ui) {
            this.ui.showToast('Connection to game server timed out. The server may be starting up - please try again in a minute.', 'error');
          }
          
          // Try reconnecting once automatically
          if (!this.reconnectionAttempted) {
            this.reconnectionAttempted = true;
            console.log('Attempting to reconnect automatically...');
            if (this.ui) {
              this.ui.showToast('Attempting to reconnect...', 'info');
            }
            this.socket.disconnect();
            setTimeout(() => this.initializeSocket(), 2000);
          }
        }
      }, 15000); // Increased from 5000 to 15000 ms
    } catch (error) {
      console.error('Error initializing socket:', error);
      this.updateConnectionStatus('disconnected', 'Connection Error');
    }
  }

  /**
   * Handle Socket.io events
   */
  handleSocketEvents() {
    // Handle socket connection
    this.socket.on('connect', () => {
      console.log('Connected to server with socket ID:', this.socket.id);
      this.socketConnected = true;
      
      // Update connection status indicator
      this.updateConnectionStatus('connected', 'Connected');
      
      // Clear connection timeout
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
    });
    
    // Handle socket disconnection
    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.socketConnected = false;
      
      // Update connection status indicator
      this.updateConnectionStatus('disconnected', 'Disconnected');
      
      if (this.ui) {
        this.ui.showToast('Disconnected from server. Please refresh the page.', 'error');
      }
    });
    
    // Handle socket connection error
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.socketConnected = false;
      
      // Update connection status indicator
      this.updateConnectionStatus('disconnected', 'Connection Error');
      
      if (this.ui) {
        this.ui.showToast('Error connecting to server. Please refresh the page.', 'error');
      }
    });
    
    // Handle room creation success
    this.socket.on('room_created', ({ roomCode, playerId, room }) => {
      this.roomCode = roomCode;
      this.playerId = playerId;
      this.isHost = true;
      
      // Update UI for waiting room
      this.ui.showWaitingRoom(room);
      this.ui.showToast(`Room created with code: ${roomCode}`, 'success');
    });
    
    // Handle joining a room
    this.socket.on('room_joined', ({ roomCode, playerId, room }) => {
      this.roomCode = roomCode;
      this.playerId = playerId;
      this.isHost = room.host === this.socket.id;
      
      // Update UI for waiting room
      this.ui.showWaitingRoom(room);
      this.ui.showToast(`Joined room: ${roomCode}`, 'success');
    });
    
    // Handle new player joining the room
    this.socket.on('player_joined', ({ room }) => {
      // Update waiting room UI
      this.ui.updateWaitingRoom(room);
      this.ui.showToast('A new player has joined the room');
    });
    
    // Handle player updates (ready status, etc.)
    this.socket.on('player_update', ({ room }) => {
      // Update waiting room UI
      this.ui.updateWaitingRoom(room);
    });
    
    // Handle player leaving
    this.socket.on('player_left', ({ room }) => {
      // Update waiting room UI
      this.ui.updateWaitingRoom(room);
      this.ui.showToast('A player has left the room');
    });
    
    // Handle host change
    this.socket.on('host_changed', ({ room, newHost }) => {
      this.isHost = newHost === this.socket.id;
      
      // Update waiting room UI
      this.ui.updateWaitingRoom(room);
      
      if (this.isHost) {
        this.ui.showToast('You are now the host of this room', 'success');
      } else {
        this.ui.showToast('The room has a new host');
      }
    });
    
    // Handle game countdown start
    this.socket.on('game_countdown_start', ({ room }) => {
      this.ui.showGameCountdown();
    });
    
    // Handle game start
    this.socket.on('game_start', ({ room }) => {
      this.startMultiplayerGame(room);
    });
    
    // Handle game updates
    this.socket.on('game_update', ({ room, lastMove }) => {
      this.updateGameState(room, lastMove);
    });
    
    // Handle errors
    this.socket.on('error', ({ message }) => {
      this.ui.showToast(message, 'error');
    });
  }

  /**
   * Update the connection status indicator
   * @param {string} status - Status class ('connecting', 'connected', 'disconnected')
   * @param {string} text - Status text to display
   */
  updateConnectionStatus(status, text) {
    // Schedule the update to ensure DOM is ready
    setTimeout(() => {
      const statusElement = document.getElementById('connection-status');
      if (statusElement) {
        // Remove all status classes
        statusElement.classList.remove('connecting', 'connected', 'disconnected');
        
        // Add the new status class
        statusElement.classList.add(status);
        
        // Update the status text
        const textElement = statusElement.querySelector('.status-text');
        if (textElement) {
          textElement.textContent = text;
        }
      } else {
        console.warn('Connection status element not found in the DOM');
      }
    }, 0);
  }

  /**
   * Create a new room
   * @param {object} roomData - Room creation data
   */
  createRoom(roomData) {
    if (!this.socket || !this.socketConnected) {
      this.ui.showToast('Not connected to server. Please try again.', 'error');
      return;
    }
    
    this.socket.emit('create_room', roomData);
  }

  /**
   * Join an existing room
   * @param {object} joinData - Room join data
   */
  joinRoom(joinData) {
    if (!this.socket || !this.socketConnected) {
      this.ui.showToast('Not connected to server. Please try again.', 'error');
      return;
    }
    
    this.socket.emit('join_room', joinData);
  }

  /**
   * Set player ready status
   * @param {boolean} isReady - Whether the player is ready
   */
  setReady(isReady) {
    this.isReady = isReady;
    
    if (!this.socket || !this.socketConnected) {
      this.ui.showToast('Not connected to server. Please try again.', 'error');
      return;
    }
    
    this.socket.emit('player_ready', {
      roomCode: this.roomCode,
      playerId: this.playerId,
      isReady: isReady
    });
  }

  /**
   * Leave the current room
   */
  leaveRoom() {
    window.location.reload();
  }

  /**
   * Start the multiplayer game
   * @param {object} room - Room data from server
   */
  startMultiplayerGame(room) {
    // Set game as running
    this.gameRunning = true;
    
    console.log('Starting multiplayer game with room data:', room);
    
    // Create players from room data
    this.players = [];
    room.players.forEach(playerData => {
      const player = new MultiplayerPlayer({
        id: playerData.id,
        name: playerData.name,
        index: playerData.index,
        startPosition: playerData.position,
        color: playerData.color,
        controls: playerData.controls,
        isCurrentPlayer: playerData.id === this.playerId
      });
      
      this.players.push(player);
    });
    
    // Get current player (for easier access)
    this.currentPlayer = this.players.find(p => p.id === this.playerId);
    
    // Initialize board with the room's board data
    this.board.init(room.gameState.board);
    
    // Update current target
    this.currentTarget = room.gameState.currentTarget;
    
    // Set player positions on the board
    this.players.forEach(player => {
      const buttons = this.board.getAllButtons();
      if (buttons && buttons.length > 0) {
        const buttonIndex = player.positionIndex - 1;
        if (buttonIndex >= 0 && buttonIndex < buttons.length) {
          console.log(`Setting player ${player.name} (${player.index}) at position ${player.positionIndex}`);
          buttons[buttonIndex].classList.add(player.getPositionClass());
        } else {
          console.error(`Invalid position for player ${player.name}: ${player.positionIndex}`);
        }
      }
    });
    
    // Bind event listeners for player movement
    this.bindKeyListeners();
    
    // Show the game UI
    this.ui.showGameScreen(this.players, this.currentTarget);
  }

  /**
   * Bind keyboard event listeners for player movement
   */
  bindKeyListeners() {
    document.addEventListener('keydown', (event) => {
      if (!this.gameRunning) return;
      
      // Only control the current player
      const player = this.currentPlayer;
      if (!player) {
        console.error('Current player not found');
        return;
      }
      
      // Determine direction based on key
      let direction = null;
      const key = event.code;
      
      console.log(`Key pressed: ${key}`);
      
      if (key === player.controls.up) {
        direction = -10; // Up
        console.log('Moving up');
      } else if (key === player.controls.right) {
        direction = 1;   // Right
        console.log('Moving right');
      } else if (key === player.controls.down) {
        direction = 10;  // Down
        console.log('Moving down');
      } else if (key === player.controls.left) {
        direction = -1;  // Left
        console.log('Moving left');
      } else if (key === player.controls.confirm) {
        // Handle confirm action
        console.log('Confirm key pressed, attempting to select number');
        this.confirmSelection();
        return;
      }
      
      // If a valid direction key was pressed, move the player
      if (direction !== null) {
        this.movePlayer(direction);
      }
    });
  }

  /**
   * Confirm selection of a number at the current player's position
   * This is the ONLY place a target number should be confirmed
   */
  confirmSelection() {
    // Only the current player can confirm selections
    const player = this.currentPlayer;
    if (!player) {
      console.error('Current player not found');
      return;
    }
    
    console.log(`Player ${player.name} confirming selection at position ${player.positionIndex}`);
    
    const buttons = this.board.getAllButtons();
    const buttonIndex = player.positionIndex - 1;
    
    if (buttonIndex < 0 || buttonIndex >= buttons.length) {
      console.error(`Invalid position for confirmation: ${player.positionIndex}`);
      return;
    }
    
    const currentButton = buttons[buttonIndex];
    if (!currentButton) {
      console.error(`Button not found at position ${player.positionIndex}`);
      return;
    }
    
    // Check if the button has the current target number
    const buttonValue = parseInt(currentButton.innerHTML, 10);
    console.log(`Checking button value ${buttonValue} against target ${this.currentTarget}`);
    
    // Send the confirmation to the server
    if (this.socket && this.socketConnected) {
      console.log(`Sending confirmation to server: player=${player.id}, position=${player.positionIndex}`);
      this.socket.emit('player_confirm', {
        roomCode: this.roomCode,
        playerId: this.playerId,
        position: player.positionIndex
      });
    } else {
      console.error('Cannot send confirmation: Socket not connected');
    }
  }

  /**
   * Move the current player
   * @param {number} direction - Direction to move
   */
  movePlayer(direction) {
    // Only the current player can be moved by the client
    const player = this.currentPlayer;
    if (!player) {
      console.error('Current player not found');
      return;
    }
    
    console.log(`Moving player ${player.name} in direction ${direction}`);
    
    // Preview the move locally for immediate feedback
    const buttons = this.board.getAllButtons();
    player.move(direction, buttons);
    
    // Send the move to the server
    if (this.socket && this.socketConnected) {
      console.log(`Sending move to server: player=${player.id}, direction=${direction}`);
      this.socket.emit('player_move', {
        roomCode: this.roomCode,
        playerId: this.playerId,
        position: player.positionIndex
      });
    } else {
      console.error('Cannot send move: Socket not connected');
    }
  }

  /**
   * Update the game state based on server data
   * @param {object} room - Updated room data
   * @param {object} lastMove - Information about the last move
   */
  updateGameState(room, lastMove) {
    console.log('Updating game state:', room.gameState);
    console.log('Last move:', lastMove);
    
    // Update current target if it changed
    if (room.gameState.currentTarget !== this.currentTarget) {
      console.log(`Target updated from ${this.currentTarget} to ${room.gameState.currentTarget}`);
      this.currentTarget = room.gameState.currentTarget;
      this.ui.updateTarget(this.currentTarget);
    }
    
    // Update player positions and scores
    room.players.forEach(serverPlayer => {
      const player = this.players.find(p => p.id === serverPlayer.id);
      if (!player) return;
      
      // Update position if changed
      if (player.positionIndex !== serverPlayer.position) {
        player.updatePosition(serverPlayer.position, this.board.getAllButtons());
      }
      
      // Update score if changed
      if (player.score !== serverPlayer.score) {
        player.score = serverPlayer.score;
        console.log(`Player ${player.name} score updated to ${player.score}`);
        
        // Update score display if available
        const scoreElement = document.getElementById(`player-score-${player.id}`);
        if (scoreElement) {
          const scoreValueElement = scoreElement.querySelector('.player-score-value');
          if (scoreValueElement) {
            scoreValueElement.textContent = player.score || 0;
          }
        }
      }
    });
    
    // Handle target found in the last move
    // IMPORTANT: Only process targetFound when explicit confirmation happened (type='confirm')
    if (lastMove && lastMove.targetFound && lastMove.type === 'confirm') {
      const player = this.players.find(p => p.id === lastMove.playerId);
      if (player) {
        console.log(`Player ${player.name} found the target ${this.currentTarget-1}`);
        
        // Add visual feedback for target found
        const buttons = this.board.getAllButtons();
        const foundButton = buttons.find(btn => parseInt(btn.innerHTML, 10) === this.currentTarget - 1);
        if (foundButton) {
          foundButton.classList.add(player.getFoundClass());
          
          // Only add animation if it's a recent find
          if (player.id === lastMove.playerId) {
            player.addFoundAnimation(foundButton);
          }
        }
      }
    }
    
    // Check if the game is over (target reached 100)
    if (room.gameState.currentTarget > 100) {
      this.gameRunning = false;
      this.ui.showGameOver(room.players);
    }
    
    // Check if any player has a score higher than 50
    const playerWithHighScore = room.players.find(player => player.score > 50);
    if (playerWithHighScore && this.gameRunning) {
      console.log(`Game over: Player ${playerWithHighScore.name} has score higher than 50`);
      this.gameRunning = false;
      this.ui.showGameOver(room.players);
    }
  }

  /**
   * Handle keyup events
   * @param {KeyboardEvent} event - The key event
   */
  handleKeyUp(event) {
    // This method might be used for special commands during the game
    // Currently not used in multiplayer
  }

  /**
   * Reset the game
   */
  reset() {
    // Reset game state
    this.gameRunning = false;
    this.currentTarget = 1;
    this.players = [];
    
    // Return to the menu
    window.location.reload();
  }
} 