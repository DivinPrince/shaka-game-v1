import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Commands to run
const commands = [
  {
    name: 'Install dependencies',
    cmd: 'npm install'
  },
  {
    name: 'Start server',
    cmd: 'npm run server'
  }
];

// Execute commands in sequence
async function runCommands() {
  for (const command of commands) {
    console.log(`\n📋 ${command.name}...`);
    
    try {
      await executeCommand(command.cmd);
      console.log(`✅ ${command.name} completed successfully.`);
    } catch (error) {
      console.error(`❌ ${command.name} failed:`, error);
      process.exit(1);
    }
  }
}

// Execute a command and return a promise
function executeCommand(cmd) {
  return new Promise((resolve, reject) => {
    const process = exec(cmd, { cwd: __dirname });
    
    process.stdout.on('data', (data) => {
      console.log(data.toString().trim());
    });
    
    process.stderr.on('data', (data) => {
      console.error(data.toString().trim());
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });
  });
}

// Start the commands
console.log('🚀 Starting Shaka Game Multiplayer Server');
runCommands().catch(console.error); 