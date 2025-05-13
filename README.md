# Shaka Game

A multiplayer number finding game built with a modular object-oriented approach.

## Features

- Local multiplayer gameplay (2 players)
- Online multiplayer with up to 10 players
- Multiple language support
- Customizable controls
- Modern architecture with reusable components

## Prerequisites

- [Bun](https://bun.sh) or [Node.js](https://nodejs.org/) - JavaScript runtime and package manager
- Modern web browser

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/shaka-game.git
   cd shaka-game
   ```

2. Install dependencies
   ```bash
   npm install
   # OR
   bun install
   ```

## Running the Game

### Local Development Mode

Run the development server with hot-reloading:
```bash
npm run dev
# OR
bun run dev
```

This will start the Vite development server at http://localhost:3000.

### Online Multiplayer Mode

To run the multiplayer server:
```bash
npm run server
# OR
node server/index.js
```

This will start the Socket.io server for multiplayer functionality.

## How to Play

### Local Mode
1. Open the game in your browser
2. Enter player names
3. Customize controls if needed
4. Press the confirm keys to get ready
5. Find the numbers in sequence

### Online Multiplayer Mode
1. Click the "Play Multiplayer" link on the main menu
2. Create a new room or join an existing one with a room code
3. Choose your name and controls
4. Wait for other players to join
5. Click "Ready" when you're ready to play
6. Find the numbers in sequence to score points

## Building for Production

Build the project for production:
```bash
npm run build
# OR
bun run build
```

This will generate optimized files in the `dist` directory.

## Project Structure

- `src/` - Source files
  - `main.js` - Entry point for local mode
  - `styles/` - CSS stylesheets
  - `utils/` - Core game classes for local mode
    - `game.js` - Main game class
    - `player.js` - Player class
    - `board.js` - Game board class
    - `translator.js` - Language translation class
    - `settings.js` - Game settings class
    - `ui-manager.js` - UI management class
  - `multiplayer/` - Multiplayer implementation
    - `main.js` - Entry point for multiplayer
    - `game.js` - Multiplayer game class
    - `player.js` - Multiplayer player class
    - `board.js` - Multiplayer board class
    - `ui-manager.js` - Multiplayer UI management
- `server/` - Server-side code for multiplayer
  - `index.js` - Socket.io server implementation

## License

MIT 