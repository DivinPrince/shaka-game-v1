/**
 * Player class to manage player functionality
 */
export class Player {
  /**
   * Create a new player
   * @param {Object} config - Player configuration
   * @param {string} config.name - Player name
   * @param {number} config.index - Player index (1, 2, etc.)
   * @param {Object} config.controls - Player controls keybindings
   * @param {string} config.color - Player color
   */
  constructor(config) {
    this.name = config.name || `Player ${config.index}`;
    this.index = config.index;
    this.controls = {
      up: config.controls?.up || 'ArrowUp',
      right: config.controls?.right || 'ArrowRight',
      down: config.controls?.down || 'ArrowDown',
      left: config.controls?.left || 'ArrowLeft',
      confirm: config.controls?.confirm || 'Enter'
    };
    this.color = config.color || '#008000';
    
    // Stats
    this.score = 0;
    this.moveCount = 0;  // Renamed from move to moveCount to avoid conflict with move method
    this.power = 0;
    this.powerCounter = 0;
    this.saves = 0;
    this.stolen = 0;
    
    // Position
    this.positionIndex = config.startPosition || 1;
    this.isReady = false;
  }

  /**
   * Get the CSS class for elements found by this player
   * @returns {string} CSS class
   */
  getFoundClass() {
    return `founded-by-player${this.index}`;
  }

  /**
   * Get the CSS class for the current position of this player
   * @returns {string} CSS class
   */
  getPositionClass() {
    return `position-of-player${this.index}`;
  }

  /**
   * Get the stolen class for this player
   * @returns {string} CSS class
   */
  getStolenClass() {
    return `stolen${this.index}`;
  }

  /**
   * Move the player
   * @param {number} direction - Direction to move (1 = right, -1 = left, 10 = down, -10 = up)
   * @param {array} buttons - Array of board buttons
   * @returns {number} New position
   */
  move(direction, buttons) {
    if (!buttons || buttons.length === 0) {
      console.error("Cannot move: no buttons provided");
      return this.positionIndex;
    }
    
    // Add debug logging
    console.log(`Player ${this.index} moving from ${this.positionIndex} by ${direction}`);
    
    // Clear previous position first
    let foundPreviousPosition = false;
    buttons.forEach(button => {
      if (button.classList.contains(this.getPositionClass())) {
        button.classList.remove(this.getPositionClass());
        foundPreviousPosition = true;
      }
    });
    
    // Only increment move counter if we actually moved
    if (foundPreviousPosition) {
      this.moveCount++;  // Use moveCount instead of move
    }
    
    // Update position
    this.positionIndex += direction;
    
    // Adjust for board boundaries
    if (this.positionIndex === 110 || this.positionIndex === 101) {
      this.positionIndex = 1;
    } else if (this.positionIndex === 101 && direction === 10) {
      this.positionIndex = 2;
    } else if (101 < this.positionIndex && this.positionIndex < 110) {
      this.positionIndex -= 99;
    } else if (this.positionIndex < 1) {
      this.positionIndex += 99;
    } else if (this.positionIndex === -9) {
      this.positionIndex = 100;
    }
    
    // Keep position in bounds (safety check)
    if (this.positionIndex < 1) this.positionIndex = 1;
    if (this.positionIndex > 100) this.positionIndex = 100;
    
    // Update visual position
    if (buttons[this.positionIndex - 1]) {
      console.log(`Setting player ${this.index} position to ${this.positionIndex}`);
      buttons[this.positionIndex - 1].classList.add(this.getPositionClass());
    } else {
      console.error(`Invalid position: ${this.positionIndex - 1}`);
    }
    
    return this.positionIndex;
  }

  /**
   * Adjust the position to ensure it stays within bounds
   * @param {number} position - Current position
   * @param {array} buttons - Board buttons
   * @returns {number} Adjusted position
   */
  adjustPosition(position, buttons) {
    // This method is now incorporated into the move method
    // Keeping it for backward compatibility
    return position;
  }

  /**
   * Check if the current position matches the target
   * @param {number} position - Current position
   * @param {array} buttons - Board buttons
   * @param {string} target - Target to find
   * @returns {boolean} True if target found
   */
  checkTarget(position, buttons, target) {
    const button = buttons[position - 1];
    if (!button) return false;

    // Check if the current position contains the target
    if (button.innerHTML == target) {
      button.classList.add(this.getFoundClass());
      return true;
    }

    // Check if current position contains a stolen item
    if (button.classList.contains(`stolen${this.index}`)) {
      button.classList.remove(`stolen${this.index}`);
      button.classList.add(this.getFoundClass());
      this.stolen++;
      this.powerCounter = 0;
      return 'stolen-recovered';
    }

    // Check if current position contains an item stolen by opponent
    const otherPlayerIndex = this.index === 1 ? 2 : 1;
    if (button.classList.contains(`stolen${otherPlayerIndex}`)) {
      button.classList.remove(`stolen${otherPlayerIndex}`);
      button.classList.add(this.getFoundClass());
      this.saves++;
      this.powerCounter = 0;
      return 'saved';
    }

    return false;
  }

  /**
   * Increment power counter and potentially steal from opponent
   * @param {Player} opponent - Opponent player
   * @param {NodeList} opponentFoundElements - Elements found by opponent
   * @returns {boolean} True if stole from opponent
   */
  incrementPower(opponent, opponentFoundElements) {
    opponent.powerCounter = 0;
    this.powerCounter += 1;

    if (this.powerCounter === 3) {
      this.power++;
      if (opponentFoundElements.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponentFoundElements.length);
        const elementToSteal = opponentFoundElements[randomIndex];
        
        elementToSteal.classList.remove(opponent.getFoundClass());
        elementToSteal.classList.add(this.getStolenClass());
        return true;
      }
    }
    
    return false;
  }

  /**
   * Update the player's bindings
   * @param {Object} controls - New controls
   */
  updateControls(controls) {
    if (controls) {
      this.controls = { ...this.controls, ...controls };
    }
  }

  /**
   * Set player ready status
   * @param {boolean} isReady - Ready status
   */
  setReady(isReady) {
    this.isReady = !!isReady;
  }
} 