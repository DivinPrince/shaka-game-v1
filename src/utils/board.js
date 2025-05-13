/**
 * Board class to manage the game board and grid
 */
export class Board {
  /**
   * Create a new game board
   * @param {Object} config - Board configuration
   * @param {string} config.containerId - ID of the container element
   * @param {number} config.rows - Number of rows
   * @param {number} config.cols - Number of columns
   */
  constructor(config = {}) {
    this.container = document.querySelector(config.containerId || 'section#numbers-parent');
    this.rows = config.rows || 10;
    this.cols = config.cols || 10;
    this.totalCells = this.rows * this.cols;
    this.buttons = [];
    this.numbers = [];
  }

  /**
   * Initialize the board
   */
  init() {
    this.generateRandomNumbers();
    this.createGrid();
  }

  /**
   * Generate random numbers for the grid
   * @param {number} min - Minimum number
   * @param {number} max - Maximum number
   * @returns {Array} Array of random numbers
   */
  generateRandomNumbers(min = 1, max = 100) {
    this.numbers = [];
    while (this.numbers.length < this.totalCells) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!this.numbers.includes(randomNumber)) {
        this.numbers.push(randomNumber);
      }
    }
    return this.numbers;
  }

  /**
   * Create the grid in the DOM
   */
  createGrid() {
    if (!this.container) {
      console.error('Board container not found');
      return;
    }

    this.container.innerHTML = '';
    
    // Create groups (rows)
    for (let i = 1; i <= this.rows; i++) {
      const group = document.createElement('div');
      group.id = `group${i}`;
      this.container.appendChild(group);
      
      // Create buttons (cells)
      for (let j = 1; j <= this.cols; j++) {
        const button = document.createElement('button');
        button.className = 'number dark-theme';
        group.appendChild(button);
      }
    }
    
    // Get all buttons and set their text
    this.buttons = [...this.container.querySelectorAll('button.number')];
    this.buttons.forEach((button, index) => {
      button.innerHTML = this.numbers[index];
    });
  }

  /**
   * Get the button at a specific position
   * @param {number} position - Position (1-based index)
   * @returns {HTMLElement} The button element
   */
  getButtonAt(position) {
    return this.buttons[position - 1];
  }

  /**
   * Get all buttons
   * @returns {Array} Array of button elements
   */
  getAllButtons() {
    return this.buttons;
  }

  /**
   * Get elements found by a specific player
   * @param {string} playerClass - CSS class for elements found by the player
   * @returns {Array} Array of found elements
   */
  getFoundByPlayer(playerClass) {
    if (!playerClass) {
      console.error('Invalid player class provided to getFoundByPlayer');
      return [];
    }
    
    try {
      const elements = [...document.querySelectorAll(`.${playerClass}`)];
      console.log(`Found ${elements.length} elements with class ${playerClass}`);
      return elements;
    } catch (error) {
      console.error('Error in getFoundByPlayer:', error);
      return [];
    }
  }

  /**
   * Reset the board
   */
  reset() {
    this.buttons.forEach(button => {
      // Remove all game-related classes
      button.className = 'number dark-theme';
    });
    this.generateRandomNumbers();
    this.updateNumbers();
  }

  /**
   * Update the numbers on the board
   */
  updateNumbers() {
    this.buttons.forEach((button, index) => {
      button.innerHTML = this.numbers[index];
    });
  }

  /**
   * Switch theme between dark and white
   * @param {string} theme - Theme to switch to ('dark' or 'white')
   */
  switchTheme(theme) {
    const themeClass = theme === 'dark' ? 'dark-theme' : 'white-theme';
    const oppositeClass = theme === 'dark' ? 'white-theme' : 'dark-theme';
    
    this.buttons.forEach(button => {
      if (button.classList.contains(oppositeClass)) {
        button.classList.remove(oppositeClass);
        button.classList.add(themeClass);
      }
    });
  }
} 