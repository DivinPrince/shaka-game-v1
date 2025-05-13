/**
 * Unified Player class for both single-player and multiplayer functionality
 */
export class Player {
  /**
   * Create a new player
   * @param {Object} config - Player configuration
   * @param {string} config.id - Player unique ID (for multiplayer)
   * @param {string} config.name - Player name
   * @param {number} config.index - Player index (1, 2, etc.)
   * @param {Object} config.controls - Player controls keybindings
   * @param {string} config.color - Player color
   * @param {boolean} config.isCurrentPlayer - Whether this is the current player (for multiplayer)
   * @param {boolean} config.isMultiplayer - Whether this player is in multiplayer mode
   */
  constructor(config) {
    this.id = config.id; // For multiplayer
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
    this.isMultiplayer = !!config.isMultiplayer;
    this.isCurrentPlayer = this.isMultiplayer ? !!config.isCurrentPlayer : true;
    
    // Stats
    this.score = 0;
    this.moveCount = 0;
    this.power = 0;
    this.powerCounter = 0;
    this.saves = 0;
    this.stolen = 0;
    
    // Position
    this.positionIndex = config.startPosition || 1;
    this.isReady = false;
    
    if (this.isMultiplayer) {
      console.log(`Player ${this.name} (${this.index}) created at position ${this.positionIndex}`);
    }
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
    
    if (this.isMultiplayer) {
      console.log(`Player ${this.index} (${this.name}) moving from ${this.positionIndex} by ${direction}`);
    } else {
      console.log(`Player ${this.index} moving from ${this.positionIndex} by ${direction}`);
    }
    
    // Clear previous position first
    let foundPreviousPosition = false;
    buttons.forEach(button => {
      if (button.classList.contains(this.getPositionClass())) {
        button.classList.remove(this.getPositionClass());
        foundPreviousPosition = true;
      }
    });
    
    if (this.isMultiplayer && !foundPreviousPosition) {
      console.warn(`Player ${this.index} position marker not found at position ${this.positionIndex}`);
    }
    
    // Increment move counter
    this.moveCount++;
    
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
      if (this.isMultiplayer) {
        console.log(`Player ${this.index} moved to position ${this.positionIndex}`);
      } else {
        console.log(`Setting player ${this.index} position to ${this.positionIndex}`);
      }
      buttons[this.positionIndex - 1].classList.add(this.getPositionClass());
    } else {
      if (this.isMultiplayer) {
        console.error(`Invalid button index: ${this.positionIndex - 1} (position: ${this.positionIndex})`);
      } else {
        console.error(`Invalid position: ${this.positionIndex - 1}`);
      }
    }
    
    return this.positionIndex;
  }

  /**
   * Update player position from server state (multiplayer only)
   * @param {number} newPosition - New position from server
   * @param {array} buttons - Array of board buttons
   */
  updatePosition(newPosition, buttons) {
    if (!this.isMultiplayer) return;
    
    // Only update if position is different
    if (newPosition === this.positionIndex) return;
    
    console.log(`Updating player ${this.index} position from ${this.positionIndex} to ${newPosition}`);
    
    // Clear previous position
    buttons.forEach(button => {
      if (button.classList.contains(this.getPositionClass())) {
        button.classList.remove(this.getPositionClass());
      }
    });
    
    // Update position
    this.positionIndex = newPosition;
    
    // Update visual position - ensure the button exists
    const buttonIndex = this.positionIndex - 1;
    if (buttonIndex >= 0 && buttonIndex < buttons.length) {
      const button = buttons[buttonIndex];
      if (button) {
        button.classList.add(this.getPositionClass());
        console.log(`Player ${this.index} position updated to ${this.positionIndex}`);
      } else {
        console.error(`Button at index ${buttonIndex} is null`);
      }
    } else {
      console.error(`Invalid button index: ${buttonIndex} (position: ${this.positionIndex})`);
    }
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
   * This should ONLY be called when explicitly confirming, not on regular movement
   * @param {number|string} position - Current position
   * @param {array} buttons - Board buttons
   * @param {number|string} target - Target to find
   * @returns {boolean} True if target found
   */
  checkTarget(position, buttons, target) {
    const buttonIndex = position - 1;
    if (buttonIndex < 0 || buttonIndex >= buttons.length) {
      if (this.isMultiplayer) {
        console.error(`Invalid position for target check: ${position}`);
      }
      return false;
    }
    
    const button = buttons[buttonIndex];
    if (!button) {
      if (this.isMultiplayer) {
        console.error(`Button not found at position ${position}`);
      }
      return false;
    }
    
    // For multiplayer, target is a number; for single-player it might be a string
    const buttonValue = this.isMultiplayer 
      ? parseInt(button.innerHTML, 10) 
      : button.innerHTML;
    
    // Check if the current position contains the target
    if (buttonValue == target) {
      if (this.isMultiplayer) {
        console.log(`Target ${target} found at position ${position} by player ${this.name}`);
      }
      button.classList.add(this.getFoundClass());
      this.score++;
      
      // Add visual feedback for multiplayer
      if (this.isMultiplayer) {
        this.addFoundAnimation(button);
      }
      
      return true;
    }
    
    // Check if current position contains a stolen item
    if (button.classList.contains(`stolen${this.index}`)) {
      button.classList.remove(`stolen${this.index}`);
      button.classList.add(this.getFoundClass());
      this.stolen++;
      this.powerCounter = 0;
      
      // Add visual feedback for multiplayer
      if (this.isMultiplayer) {
        this.addFoundAnimation(button);
      }
      
      return 'stolen-recovered';
    }

    // Check if current position contains an item stolen by opponent
    const otherPlayerIndex = this.index === 1 ? 2 : 1;
    if (button.classList.contains(`stolen${otherPlayerIndex}`)) {
      button.classList.remove(`stolen${otherPlayerIndex}`);
      button.classList.add(this.getFoundClass());
      this.saves++;
      this.powerCounter = 0;
      
      // Add visual feedback for multiplayer
      if (this.isMultiplayer) {
        this.addFoundAnimation(button);
      }
      
      return 'saved';
    }
    
    return false;
  }

  /**
   * Add a visual animation to a found target (multiplayer only)
   * @param {HTMLElement} button - The button element
   */
  addFoundAnimation(button) {
    if (!this.isMultiplayer) return;
    
    // Add a temporary highlight class
    button.classList.add('found-highlight');
    
    // Remove the class after animation completes
    setTimeout(() => {
      button.classList.remove('found-highlight');
    }, 1000);
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