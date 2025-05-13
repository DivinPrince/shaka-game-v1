import { Player } from './player.js';
import { Board } from './board.js';
import { Settings } from './settings.js';
import { Translator } from './translator.js';
import { UIManager } from './ui-manager.js';

/**
 * Main Game class to coordinate all game components
 */
export class Game {
  /**
   * Create a new game instance
   */
  constructor() {
    // Initialize game components
    this.settings = new Settings();
    this.ui = new UIManager();
    this.translator = new Translator();
    this.board = new Board();
    
    // Game state
    this.players = [];
    this.currentTarget = 1;
    this.gameRunning = false;
    this.countdownIndex = 0;
    this.canOpenGame = false;
    
    // Countdown levels
    this.levels = [3, 2, 1, 'Go!'];
    
    // Bind events to this instance
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.updateControllers = this.updateControllers.bind(this);
    this.levelCountdown = this.levelCountdown.bind(this);
  }

  /**
   * Initialize the game
   */
  init() {
    // Initialize settings
    this.settings.init();
    
    // Create players with default configurations
    this.createPlayers();
    
    // Initialize the board
    this.board.init();
    
    // Bind events
    this.bindEvents();
    
    // Start the level countdown
    this.countdownInterval = setInterval(this.levelCountdown, 1000);
  }

  /**
   * Create players
   */
  createPlayers() {
    // Create player 1
    const player1 = new Player({
      name: 'Player 1',
      index: 1,
      startPosition: 1,
      color: '#008000',
      controls: {
        up: 'KeyW',
        right: 'KeyD',
        down: 'KeyS',
        left: 'KeyA',
        confirm: 'CapsLock'
      }
    });
    
    // Create player 2
    const player2 = new Player({
      name: 'Player 2',
      index: 2,
      startPosition: 10,
      color: '#ffa500',
      controls: {
        up: 'ArrowUp',
        right: 'ArrowRight',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        confirm: 'Enter'
      }
    });
    
    this.players.push(player1, player2);
  }

  /**
   * Bind game events
   */
  bindEvents() {
    // Controller update events
    this.ui.bindControllerEvents(this.updateControllers);
    
    // Player key events
    this.players.forEach((player, index) => {
      const opponent = this.players[index === 0 ? 1 : 0];
      
      this.ui.bindPlayerKeyEvents(
        player,
        (direction, keyCode) => this.movePlayer(player, direction, keyCode),
        (position) => this.checkPlayerTarget(player, opponent, position)
      );
    });
    
    // Pause event
    this.ui.bindPauseEvent();
    
    // Ready event
    document.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Handle key up event for player readiness
   * @param {KeyboardEvent} event - The key event
   */
  handleKeyUp(event) {
    const player1 = this.players[0];
    const player2 = this.players[1];

    // Check if players have entered their names
    const playersName = this.ui.elements.playersName;
    const flipInputs = this.ui.elements.flipInputs;
    
    if (!playersName || !flipInputs) return;
    
    // Make sure names are different and not empty
    if (playersName[0].value.trim() !== playersName[1].value.trim()) {
      // Player 1 ready
      if (playersName[0].value.trim().length > 2) {
        if (event.code === player1.controls.confirm) {
          this.ui.elements.startInputs[0].value = playersName[0].value.trim();
          player1.name = playersName[0].value.trim();
          flipInputs[0].classList.add('ready');
          player1.setReady(true);
        }
      }
      
      // Player 2 ready
      if (playersName[1].value.trim().length > 2) {
        if (event.code === player2.controls.confirm) {
          this.ui.elements.startInputs[1].value = playersName[1].value.trim();
          player2.name = playersName[1].value.trim();
          flipInputs[1].classList.add('ready');
          player2.setReady(true);
        }
      }
      
      // Both players ready
      if (player1.isReady && player2.isReady) {
        this.canOpenGame = true;
      }
    }
  }

  /**
   * Level countdown handler
   */
  levelCountdown() {
    if (this.canOpenGame) {
      this.countdownIndex = this.ui.updateLevelDisplay(
        this.countdownIndex,
        this.levels,
        () => this.ui.showGameReadyScreen()
      );
      
      if (this.countdownIndex >= this.levels.length) {
        clearInterval(this.countdownInterval);
        this.startGame();
      }
    }
  }

  /**
   * Update controller settings based on UI inputs
   */
  updateControllers() {
    const player1 = this.players[0];
    const player2 = this.players[1];
    
    const inputs1 = this.ui.elements.optionInputs1;
    const inputs2 = this.ui.elements.optionInputs2;
    
    if (inputs1 && inputs1.length >= 5) {
      player1.updateControls({
        up: inputs1[0].value,
        right: inputs1[1].value,
        down: inputs1[2].value,
        left: inputs1[3].value,
        confirm: inputs1[4].value
      });
    }
    
    if (inputs2 && inputs2.length >= 5) {
      player2.updateControls({
        up: inputs2[0].value,
        right: inputs2[1].value,
        down: inputs2[2].value,
        left: inputs2[3].value,
        confirm: inputs2[4].value
      });
    }
  }

  /**
   * Start the game
   */
  startGame() {
    // Set game as running to allow player movement
    this.gameRunning = true;
    
    // Initialize player positions on the board
    const buttons = this.board.getAllButtons();
    this.players.forEach(player => {
      // Clear any previous positions
      buttons.forEach(button => {
        if (button.classList.contains(player.getPositionClass())) {
          button.classList.remove(player.getPositionClass());
        }
      });
      
      // Set initial position
      if (buttons[player.positionIndex - 1]) {
        buttons[player.positionIndex - 1].classList.add(player.getPositionClass());
      }
    });
    
    // Set the first target
    this.updateTarget(1);
  }

  /**
   * Update the current target
   * @param {number} target - New target value
   */
  updateTarget(target) {
    this.currentTarget = target;
    
    const targetElement = document.querySelector('section#numbers-head span#current-target');
    if (targetElement) {
      targetElement.className = target.toString();
      
      // Translate the number based on selected language
      const language = this.settings.get('language');
      const translatedWord = this.translator.translateNumber(target, language);
      targetElement.textContent = translatedWord;
      
      // Read the target if enabled
      if (this.settings.get('reader') === 'on') {
        this.translator.speak(`find ${translatedWord}`, this.settings.get('readingSpeed'));
      }
    }
  }

  /**
   * Move a player
   * @param {Player} player - The player to move
   * @param {number} direction - Direction to move
   * @param {number} keyCode - Key code that triggered the move
   */
  movePlayer(player, direction, keyCode) {
    if (!this.gameRunning) {
      console.log("Game not running yet, movement disabled");
      return;
    }
    
    const buttons = this.board.getAllButtons();
    if (!buttons || buttons.length === 0) {
      console.log("No board buttons found");
      return;
    }
    
    // Log movement for debugging
    console.log(`Moving player ${player.index} in direction ${direction}`);
    
    // Move the player
    player.move(direction, buttons);
  }

  /**
   * Check if a player found the target
   * @param {Player} player - The player checking
   * @param {Player} opponent - The opponent player
   * @param {number} position - Current position
   */
  checkPlayerTarget(player, opponent, position) {
    if (!this.gameRunning) return;
    
    const buttons = this.board.getAllButtons();
    const result = player.checkTarget(position, buttons, this.currentTarget.toString());
    
    if (result === true) {
      // Target found, update to next target
      this.updateTarget(this.currentTarget + 1);
      
      // Increment player power and potentially steal
      const opponentFoundElements = this.board.getFoundByPlayer(opponent.getFoundClass());
      player.incrementPower(opponent, opponentFoundElements);
      
      // Update scores
      this.updateScores();
      
      // Check for game over
      this.checkGameOver();
    } else if (result === 'stolen-recovered' || result === 'saved') {
      // Handle stolen/saved item
      this.updateScores();
    }
  }

  /**
   * Update player scores
   */
  updateScores() {
    const player1 = this.players[0];
    const player2 = this.players[1];
    
    const player1FoundElements = this.board.getFoundByPlayer(player1.getFoundClass());
    const player2FoundElements = this.board.getFoundByPlayer(player2.getFoundClass());
    
    this.ui.updatePlayerScore(player1, player2FoundElements.length);
    this.ui.updatePlayerScore(player2, player1FoundElements.length);
  }

  /**
   * Check if the game is over
   */
  checkGameOver() {
    if (this.currentTarget > 100) {
      this.gameRunning = false;
      this.ui.showGameOver(this.players[0], this.players[1]);
    }
  }

  /**
   * Reset the game
   */
  reset() {
    // Reset board
    this.board.reset();
    
    // Reset players
    this.players.forEach(player => {
      player.score = 0;
      player.moveCount = 0;
      player.power = 0;
      player.powerCounter = 0;
      player.saves = 0;
      player.stolen = 0;
    });
    
    // Reset game state
    this.currentTarget = 1;
    this.gameRunning = false;
    this.countdownIndex = 0;
    this.canOpenGame = false;
    
    // Update UI
    this.updateTarget(1);
  }
} 