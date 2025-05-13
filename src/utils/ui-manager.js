/**
 * UIManager class to handle DOM interactions and UI updates
 */
export class UIManager {
  /**
   * Create a new UI manager
   */
  constructor() {
    // UI element references
    this.elements = {
      cover: document.querySelector('#pause-cover'),
      screenIcon: document.querySelector('#screen'),
      names: document.querySelector('#names'),
      playersName: document.querySelectorAll('#names dir.flip input'),
      flipInputs: document.querySelectorAll('#names dir.flip'),
      startInputs: document.querySelectorAll('section#numbers-head input'),
      optionOpen: document.querySelector('button#startOption'),
      optionClose: document.querySelector('button#endOption'),
      optionParent: document.querySelector('#options'),
      optionInputs: document.querySelectorAll('#options #player-controls input'),
      optionInputs1: document.querySelectorAll('#options #player-controls #controls1 input'),
      optionInputs2: document.querySelectorAll('#options #player-controls #controls2 input'),
      gameOver: document.querySelector('#game-over'),
      playerWithHighScore: document.querySelector('#game-over #winner span'),
      pages: document.querySelector('#pages')?.children
    };
    
    this.bindBasicEvents();
  }

  /**
   * Bind basic UI events
   */
  bindBasicEvents() {
    // Options button events
    if (this.elements.optionOpen && this.elements.optionClose && this.elements.optionParent) {
      this.elements.optionOpen.addEventListener('click', () => {
        this.elements.optionParent.style.display = 'flex';
      });
      
      this.elements.optionClose.addEventListener('click', () => {
        this.elements.optionParent.style.display = 'none';
      });
    }

    // Add event listener for the Play button
    const playButton = document.querySelector('#numbersChoice');
    if (playButton) {
      playButton.addEventListener('click', () => {
        const introPage = document.querySelector('#introPage');
        if (introPage) {
          introPage.style.display = 'none';
        }
        
        // Show the names input section
        if (this.elements.names) {
          this.elements.names.style.display = 'flex';
        }
      });
    }

    // Page selection events
    if (this.elements.pages) {
      Array.from(this.elements.pages).forEach(page => {
        page.addEventListener('mouseover', () => {
          Array.from(this.elements.pages).forEach(p => {
            p.classList.remove('over');
          });
          page.classList.add('over');
        });
      });
    }

    // Toggle fullscreen event
    if (this.elements.screenIcon) {
      this.elements.screenIcon.addEventListener('click', () => {
        if (document.fullscreenElement) {
          this.closeFullScreen();
        } else {
          this.openFullScreen();
        }
      });
    }
  }

  /**
   * Handle key events for a specific player
   * @param {Player} player - The player object
   * @param {Function} moveCallback - Function to call on move
   * @param {Function} checkCallback - Function to call on check
   */
  bindPlayerKeyEvents(player, moveCallback, checkCallback) {
    document.addEventListener('keydown', (event) => {
      if (event.code === player.controls.right) {
        moveCallback(1, event.keyCode);
      } else if (event.code === player.controls.left) {
        moveCallback(-1, event.keyCode);
      } else if (event.code === player.controls.down) {
        moveCallback(10, event.keyCode);
      } else if (event.code === player.controls.up) {
        moveCallback(-10, event.keyCode);
      } else if (event.code === player.controls.confirm) {
        checkCallback(player.positionIndex);
      }
    });
  }

  /**
   * Bind controller input events
   * @param {Function} updateCallback - Function to call when controls are updated
   */
  bindControllerEvents(updateCallback) {
    // Handle focus on controller inputs
    this.elements.optionInputs.forEach(input => {
      input.addEventListener('focus', e => {
        if (e.target.getAttribute('type') === 'text') {
          e.target.dataset.inputFocus = 'true';
          e.target.style.outline = 'auto';
        }
      });
    });

    // Handle keyup for controller inputs
    document.addEventListener('keyup', e => {
      const focusedInput = document.querySelector('#options #player-controls input[data-input-focus="true"]');
      if (focusedInput) {
        focusedInput.value = e.code;
        focusedInput.dataset.inputFocus = 'false';
        focusedInput.style.outline = 'none';
        updateCallback();
      }
    });
  }

  /**
   * Bind pause game event
   */
  bindPauseEvent() {
    document.addEventListener('keydown', e => {
      if (e.keyCode === 32) { // Spacebar
        this.togglePause();
      }
    });
  }

  /**
   * Toggle game pause state
   */
  togglePause() {
    if (this.elements.cover) {
      this.elements.cover.classList.toggle('pause');
    }
  }

  /**
   * Open fullscreen mode
   */
  openFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    
    if (this.elements.screenIcon) {
      this.elements.screenIcon.setAttribute('onclick', 'closeFullScreen()');
      this.elements.screenIcon.setAttribute('class', 'fas fa-compress');
    }
  }

  /**
   * Close fullscreen mode
   */
  closeFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    
    if (this.elements.screenIcon) {
      this.elements.screenIcon.setAttribute('onclick', 'openFullScreen()');
      this.elements.screenIcon.setAttribute('class', 'fas fa-expand');
    }
  }

  /**
   * Show game ready screen
   */
  showGameReadyScreen() {
    if (this.elements.names) {
      this.elements.names.classList.add('open');
    }
  }

  /**
   * Update player score display
   * @param {Player} player - The player
   * @param {number} opponentFoundCount - Number of elements found by opponent
   */
  updatePlayerScore(player, opponentFoundCount) {
    const scoreElement = document.querySelector(`section#numbers-head span#player${player.index === 1 ? 2 : 1}`);
    if (scoreElement) {
      player.score = opponentFoundCount;
      scoreElement.textContent = player.score;
    }
  }

  /**
   * Display the game over screen with player statistics
   * @param {Player} player1 - First player
   * @param {Player} player2 - Second player
   */
  showGameOver(player1, player2) {
    if (!this.elements.gameOver) return;
    
    // Get all the elements we need to update
    const names = this.elements.gameOver.querySelectorAll('.names p');
    const moves = this.elements.gameOver.querySelectorAll('#move span');
    const powers = this.elements.gameOver.querySelectorAll('#power span');
    const saves = this.elements.gameOver.querySelectorAll('#saves span');
    const stolens = this.elements.gameOver.querySelectorAll('#stolen span');
    const scores = this.elements.gameOver.querySelectorAll('#score span dir');

    // Update the game over screen
    this.elements.gameOver.style.display = 'flex';
    
    // Set player names
    if (names[0]) names[0].textContent = player1.name;
    if (names[1]) names[1].textContent = player2.name;
    
    // Set player stats - using moveCount instead of move
    if (moves[0]) moves[0].textContent = player1.moveCount;
    if (moves[1]) moves[1].textContent = player2.moveCount;
    
    if (powers[0]) powers[0].textContent = player1.power;
    if (powers[1]) powers[1].textContent = player2.power;
    
    if (saves[0]) saves[0].textContent = player1.saves;
    if (saves[1]) saves[1].textContent = player2.saves;
    
    if (stolens[0]) stolens[0].textContent = player1.stolen;
    if (stolens[1]) stolens[1].textContent = player2.stolen;
    
    if (scores[0]) scores[0].textContent = player2.score;
    if (scores[1]) scores[1].textContent = player1.score;
    
    // Determine winner
    if (this.elements.playerWithHighScore) {
      if (parseInt(player1.score) > parseInt(player2.score)) {
        this.elements.playerWithHighScore.textContent = player2.name;
      } else if (parseInt(player2.score) > parseInt(player1.score)) {
        this.elements.playerWithHighScore.textContent = player1.name;
      } else {
        this.elements.playerWithHighScore.textContent = 'Tie: ' + player1.name + ' & ' + player2.name;
      }
    }
    
    // Update target display
    const targetElement = document.querySelector('section#numbers-head span#current-target');
    if (targetElement && targetElement.parentElement) {
      targetElement.parentElement.textContent = 'Done';
    }
  }

  /**
   * Switch theme between dark and white
   */
  switchTheme() {
    const whiteElements = [...document.querySelectorAll('.white-theme')];
    const darkElements = [...document.querySelectorAll('.dark-theme')];
    
    if (whiteElements.length < 1) {
      // Switch to white theme
      darkElements.forEach(element => {
        element.classList.remove('dark-theme');
        element.classList.add('white-theme');
      });
    } else {
      // Switch to dark theme
      whiteElements.forEach(element => {
        element.classList.remove('white-theme');
        element.classList.add('dark-theme');
      });
    }
  }

  /**
   * Handle the level display countdown
   * @param {number} index - Current index in the countdown
   * @param {Array} levels - Level text array
   * @param {Function} callback - Function to call when countdown completes
   * @returns {number} Updated index
   */
  updateLevelDisplay(index, levels, callback) {
    const startButton = document.querySelector('#numbers #start');
    if (!startButton) return index;
    
    startButton.innerHTML = levels[index];
    
    // Check if this is the last step in the countdown
    if (index >= levels.length - 1) {
      // After showing "Go!", prepare to start the game
      startButton.focus();
      this.openFullScreen();
      
      // Show game screen with smooth transition
      if (this.elements.names) {
        this.elements.names.classList.add('open');
        
        // Give a short delay before hiding the names screen
        // to allow the transition to complete
        setTimeout(() => {
          // Keep the transition smooth by not hiding completely
          // We just want the board to be visible underneath
          if (this.elements.names) {
            this.elements.names.style.opacity = '0.3';
            
            // Execute the callback (which should show the game board)
            callback();
          }
        }, 800);
      }
      
      // Return the next index (to trigger game start)
      return index + 1;
    }
    
    // Return the next index for countdown
    return index + 1;
  }
} 