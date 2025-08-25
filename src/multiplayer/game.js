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
    
    // WebSocket connection
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
    this.reconnectToServer = this.reconnectToServer.bind(this);
  }

  /**
   * Initialize the multiplayer game
   */
  init() {
    // Initialize settings
    this.settings.init();
    
    // Initialize WebSocket connection - do this first
    this.initializeSocket();
    
    // Initialize UI after socket connection attempt
    setTimeout(() => {
      // Create UI manager
      this.ui = new MultiplayerUIManager(this);
      this.ui.init();
      
      // Bind reconnect button
      const reconnectBtn = document.getElementById('reconnect-btn');
      if (reconnectBtn) {
        reconnectBtn.addEventListener('click', this.reconnectToServer);
      }
    }, 800);
  }

  /**
   * Initialize WebSocket connection
   */
  initializeSocket() {
    try {
      const isDevEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      // Create WebSocket connection
      const serverUrl = 'wss://mm74owuczg.relais.dev';
      console.log('Attempting to connect to WebSocket server at:', serverUrl);
      
      this.socket = new WebSocket(serverUrl);
      
      // Set up socket event handlers
      this.handleSocketEvents();
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.updateConnectionStatus('disconnected', 'Connection Error');
    }
  }

  /**
   * Handle WebSocket events
   */
  handleSocketEvents() {
    // Handle socket connection open
    this.socket.onopen = () => {
      console.log('Connected to server');
      this.socketConnected = true;
      
      // Update connection status indicator
      this.updateConnectionStatus('connected', 'Connected');
      
      // Clear connection timeout
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
    };
    
    // Handle socket messages
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        
        // Handle different event types
        switch (data.event) {
          case 'room_created':
            this.handleRoomCreated(data.data);
            break;
          case 'room_joined':
            this.handleRoomJoined(data.data);
            break;
          case 'player_joined':
            this.handlePlayerJoined(data.data);
            break;
          case 'player_update':
            this.handlePlayerUpdate(data.data);
            break;
          case 'player_left':
            this.handlePlayerLeft(data.data);
            break;
          case 'host_changed':
            this.handleHostChanged(data.data);
            break;
          case 'game_countdown_start':
            this.handleGameCountdownStart(data.data);
            break;
          case 'game_start':
            this.handleGameStart(data.data);
            break;
          case 'game_update':
            this.handleGameUpdate(data.data);
            break;
          case 'error':
            this.handleError(data.data);
            break;
          default:
            console.warn('Unhandled WebSocket message type:', data.type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };
    
    // Handle socket disconnection
    this.socket.onclose = (event) => {
      console.log('Disconnected from server:', event.code, event.reason);
      this.socketConnected = false;
      
      // Update connection status indicator
      this.updateConnectionStatus('disconnected', 'Disconnected');
      
      if (this.ui) {
        this.ui.showToast('Disconnected from server. Click the reconnect button to try again.', 'error');
      }
    };
    
    // Handle socket connection error
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.socketConnected = false;
      
      // Update connection status indicator
      this.updateConnectionStatus('disconnected', 'Connection Error');
      
      if (this.ui) {
        this.ui.showToast('Error connecting to server. Click the reconnect button to try again.', 'error');
      }
    };
  }

  /**
   * Send a message to the WebSocket server
   * @param {string} type - Message type
   * @param {object} payload - Message payload
   */
  sendMessage(type, payload) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.ui.showToast('Not connected to server. Please try again.', 'error');
      return;
    }
    
    const message = JSON.stringify({
      type: type,
      payload: payload
    });
    
    this.socket.send(message);
  }

  /**
   * Handle room creation success
   * @param {object} data - Room creation data
   */
  handleRoomCreated(data) {
    const { roomCode, playerId, room } = data;
    this.roomCode = roomCode;
    this.playerId = playerId;
    this.isHost = true;
    
    // Update UI for waiting room
    this.ui.showWaitingRoom(room);
    this.ui.showToast(`Room created with code: ${roomCode}`, 'success');
  }

  /**
   * Handle joining a room
   * @param {object} data - Room join data
   */
  handleRoomJoined(data) {
    const { roomCode, playerId, room } = data;
    this.roomCode = roomCode;
    this.playerId = playerId;
    this.isHost = room.host === this.playerId;
    
    // Update UI for waiting room
    this.ui.showWaitingRoom(room);
    this.ui.showToast(`Joined room: ${roomCode}`, 'success');
  }

  /**
   * Handle new player joining the room
   * @param {object} data - Player joined data
   */
  handlePlayerJoined(data) {
    const { room } = data;
    // Update waiting room UI
    this.ui.updateWaitingRoom(room);
    this.ui.showToast('A new player has joined the room');
  }

  /**
   * Handle player updates (ready status, etc.)
   * @param {object} data - Player update data
   */
  handlePlayerUpdate(data) {
    const { room } = data;
    // Update waiting room UI
    this.ui.updateWaitingRoom(room);
  }

  /**
   * Handle player leaving
   * @param {object} data - Player left data
   */
  handlePlayerLeft(data) {
    const { room } = data;
    // Update waiting room UI
    this.ui.updateWaitingRoom(room);
    this.ui.showToast('A player has left the room');
  }

  /**
   * Handle host change
   * @param {object} data - Host changed data
   */
  handleHostChanged(data) {
    const { room, newHost } = data;
    this.isHost = newHost === this.playerId;
    
    // Update waiting room UI
    this.ui.updateWaitingRoom(room);
    
    if (this.isHost) {
      this.ui.showToast('You are now the host of this room', 'success');
    } else {
      this.ui.showToast('The room has a new host');
    }
  }

  /**
   * Handle game countdown start
   * @param {object} data - Countdown data
   */
  handleGameCountdownStart(data) {
    const { room } = data;
    this.ui.showGameCountdown();
  }

  /**
   * Handle game start
   * @param {object} data - Game start data
   */
  handleGameStart(data) {
    const { room } = data;
    this.startMultiplayerGame(room);
  }

  /**
   * Handle game updates
   * @param {object} data - Game update data
   */
  handleGameUpdate(data) {
    const { room, lastMove } = data;
    this.updateGameState(room, lastMove);
  }

  /**
   * Handle errors
   * @param {object} data - Error data
   */
  handleError(data) {
    const { message } = data;
    this.ui.showToast(message, 'error');
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
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.ui.showToast('Not connected to server. Please try again.', 'error');
      return;
    }
    
    this.sendMessage('create_room', roomData);
  }

  /**
   * Join an existing room
   * @param {object} joinData - Room join data
   */
  joinRoom(joinData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.ui.showToast('Not connected to server. Please try again.', 'error');
      return;
    }
    
    this.sendMessage('join_room', joinData);
  }

  /**
   * Set player ready status
   * @param {boolean} isReady - Whether the player is ready
   */
  setReady(isReady) {
    this.isReady = isReady;
    
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.ui.showToast('Not connected to server. Please try again.', 'error');
      return;
    }
    
    this.sendMessage('player_ready', {
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
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log(`Sending confirmation to server: player=${player.id}, position=${player.positionIndex}`);
      this.sendMessage('player_confirm', {
        roomCode: this.roomCode,
        playerId: this.playerId,
        position: player.positionIndex
      });
    } else {
      console.error('Cannot send confirmation: WebSocket not connected');
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
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log(`Sending move to server: player=${player.id}, direction=${direction}`);
      this.sendMessage('player_move', {
        roomCode: this.roomCode,
        playerId: this.playerId,
        position: player.positionIndex
      });
    } else {
      console.error('Cannot send move: WebSocket not connected');
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
      
      // Update position if changed for other players
      if (player.id !== this.playerId && player.positionIndex !== serverPlayer.position) {
        player.updatePosition(serverPlayer.position, this.board.getAllButtons());
      }
      
      // Update score for all players, including the current player
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

  /**
   * Reconnect to the server
   */
  reconnectToServer() {
    // Update UI to show connecting status
    this.updateConnectionStatus('connecting', 'Reconnecting...');
    
    if (this.ui) {
      this.ui.showToast('Attempting to reconnect to server...', '');
    }
    
    // Clear any existing socket
    if (this.socket) {
      // Remove event listeners to prevent memory leaks
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      
      // Close the socket if it's still open
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
      }
      
      this.socket = null;
    }
    
    // Initialize a new socket connection
    this.initializeSocket();
    
    // If we were in a room before, try to rejoin automatically
    if (this.roomCode && this.playerId) {
      // Wait a bit to ensure connection is established before attempting to rejoin
      setTimeout(() => {
        if (this.socketConnected) {
          // Send message to server to rejoin the room
          this.sendMessage('rejoin_room', {
            roomCode: this.roomCode,
            playerId: this.playerId
          });
        }
      }, 1000);
    }
  }
} 