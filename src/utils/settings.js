/**
 * Settings class to manage game configuration
 */
export class Settings {
  constructor() {
    this.defaultSettings = {
      time: 3,
      reader: 'on',
      language: 'english',
      readingSpeed: 1,
      showTarget: true
    };
    
    this.settings = {...this.defaultSettings};
    this.listeners = [];
  }

  /**
   * Initialize settings from DOM elements
   */
  init() {
    this.bindUIElements();
  }

  /**
   * Bind UI elements to settings changes
   */
  bindUIElements() {
    // Language select
    const languageSelect = document.querySelector('select#language');
    if (languageSelect) {
      languageSelect.addEventListener('input', (e) => {
        this.set('language', e.target.value);
        this.setupLanguageUI(e.target.value);
      });
    }

    // Time select
    const timeSelect = document.querySelector('select#time');
    if (timeSelect) {
      timeSelect.addEventListener('input', (e) => {
        this.set('time', parseFloat(e.target.value));
      });
    }

    // Reading speed select
    const speedSelect = document.querySelector('select#reading-speed');
    if (speedSelect) {
      speedSelect.addEventListener('input', (e) => {
        this.set('readingSpeed', parseFloat(e.target.value));
      });
    }

    // Reader radios
    const readerRadios = [...document.querySelectorAll('input[type=radio][name=reader]')];
    readerRadios.forEach(radio => {
      radio.addEventListener('input', (e) => {
        this.set('reader', e.target.value);
      });
    });

    // Show target checkbox
    const targetCheck = document.querySelector('input[type=checkbox]#target-check');
    if (targetCheck) {
      targetCheck.addEventListener('change', (e) => {
        this.set('showTarget', e.target.checked);
      });
    }
  }

  /**
   * Set up language-specific UI elements
   */
  setupLanguageUI(language) {
    const targetElement = document.querySelector('section#numbers-head > div');
    if (!targetElement) return;

    const languagePrompts = {
      'kinyarwanda': { prompt: 'Shaka:', value: 'Rimwe' },
      'english': { prompt: 'Find:', value: 'One' },
      'france': { prompt: 'Chercher:', value: 'Un' },
      'roman': { prompt: 'Find:', value: 'I' }
    };

    const { prompt, value } = languagePrompts[language] || languagePrompts.english;
    targetElement.innerHTML = `<p>${prompt}</p><span id="current-target" class="1">${value}</span>`;
  }

  /**
   * Get a setting value
   * @param {string} key - The setting key
   * @returns {any} The setting value
   */
  get(key) {
    return this.settings[key];
  }

  /**
   * Set a setting value
   * @param {string} key - The setting key
   * @param {any} value - The new value
   */
  set(key, value) {
    this.settings[key] = value;
    this.notifyListeners(key, value);
  }

  /**
   * Add a listener for settings changes
   * @param {Function} listener - Callback function(key, value)
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Notify all listeners about a setting change
   * @param {string} key - The changed setting key
   * @param {any} value - The new value
   */
  notifyListeners(key, value) {
    this.listeners.forEach(listener => listener(key, value));
  }

  /**
   * Reset settings to defaults
   */
  reset() {
    this.settings = {...this.defaultSettings};
    Object.keys(this.settings).forEach(key => {
      this.notifyListeners(key, this.settings[key]);
    });
  }
} 