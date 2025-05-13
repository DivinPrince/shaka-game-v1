# Shaka Game

A multiplayer number finding game built with a modular object-oriented approach.

## Features

- Multiplayer gameplay
- Multiple language support
- Customizable controls
- Modern architecture with reusable components

## Prerequisites

- [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
- Modern web browser

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/shaka-game.git
   cd shaka-game
   ```

2. Install dependencies with Bun
   ```bash
   bun install
   ```

## Development

Run the development server with hot-reloading:
```bash
bun run dev
```

This will start the Vite development server at http://localhost:3000.

## Building for Production

Build the project for production:
```bash
bun run build
```

This will generate optimized files in the `dist` directory.

## Preview Production Build

To preview the production build locally:
```bash
bun run preview
```

## Project Structure

- `src/` - Source files
  - `main.js` - Entry point
  - `styles.js` - Style imports
- `game.js` - Main game class
- `player.js` - Player class
- `board.js` - Game board class
- `translator.js` - Language translation class
- `settings.js` - Game settings class
- `ui-manager.js` - UI management class
- `styles/` - CSS stylesheets

## License

MIT 