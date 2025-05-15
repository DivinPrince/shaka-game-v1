/**
 * Multiplayer Player class
 */
export class MultiplayerPlayer {
  /**
   * Create a new multiplayer player
   * @param {Object} config - Player configuration
   * @param {string} config.id - Player unique ID
   * @param {string} config.name - Player name
   * @param {number} config.index - Player index (1, 2, etc.)
   * @param {Object} config.controls - Player controls keybindings
   * @param {string} config.color - Player color
   * @param {boolean} config.isCurrentPlayer - Whether this is the current player
   */
  constructor(config) {
    this.id = config.id;
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
    this.isCurrentPlayer = !!config.isCurrentPlayer;
    
    // Stats
    this.score = 0;
    this.moveCount = 0;
    
    // Position
    this.positionIndex = config.startPosition || 1;
    this.isReady = false;
    
    console.log(`Player ${this.name} (${this.index}) created at position ${this.positionIndex}`);
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
    
    console.log(`Player ${this.index} (${this.name}) moving from ${this.positionIndex} by ${direction}`);
    
    // Clear previous position first
    let foundPreviousPosition = false;
    buttons.forEach(button => {
      if (button.classList.contains(this.getPositionClass())) {
        button.classList.remove(this.getPositionClass());
        foundPreviousPosition = true;
      }
    });
    
    if (!foundPreviousPosition) {
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
    
    // Update visual position - ensure the button exists
    const buttonIndex = this.positionIndex - 1;
    if (buttonIndex >= 0 && buttonIndex < buttons.length) {
      const button = buttons[buttonIndex];
      if (button) {
        button.classList.add(this.getPositionClass());
        console.log(`Player ${this.index} moved to position ${this.positionIndex}`);
      } else {
        console.error(`Button at index ${buttonIndex} is null`);
      }
    } else {
      console.error(`Invalid button index: ${buttonIndex} (position: ${this.positionIndex})`);
    }
    
    // No auto-confirm check here - only move
    
    return this.positionIndex;
  }

  /**
   * Update player position from server state
   * @param {number} newPosition - New position from server
   * @param {array} buttons - Array of board buttons
   */
  updatePosition(newPosition, buttons) {
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
   * Check if the current position matches the target
   * This should ONLY be called when explicitly confirming, not on regular movement
   * @param {number} position - Current position
   * @param {array} buttons - Board buttons
   * @param {number} target - Target to find
   * @returns {boolean} True if target found
   */
  checkTarget(position, buttons, target) {
    const buttonIndex = position - 1;
    if (buttonIndex < 0 || buttonIndex >= buttons.length) {
      console.error(`Invalid position for target check: ${position}`);
      return false;
    }
    
    const button = buttons[buttonIndex];
    if (!button) {
      console.error(`Button not found at position ${position}`);
      return false;
    }
    
    const buttonValue = parseInt(button.innerHTML, 10);
    
    // Check if the current position contains the target
    if (buttonValue === target) {
      console.log(`Target ${target} found at position ${position} by player ${this.name}`);
      button.classList.add(this.getFoundClass());
      this.score++;
      
      // Add visual feedback
      this.addFoundAnimation(button);
      
      return true;
    }
    
    return false;
  }

  /**
   * Add a visual animation to a found target
   * @param {HTMLElement} button - The button element
   */
  addFoundAnimation(button) {
    // Add a temporary highlight class
    button.classList.add('found-highlight');
    
    // Remove the class after animation completes
    setTimeout(() => {
      button.classList.remove('found-highlight');
    }, 1000);
  }

  /**
   * Set player ready status
   * @param {boolean} isReady - Ready status
   */
  setReady(isReady) {
    this.isReady = !!isReady;
  }
} 