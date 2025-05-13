import { defineConfig } from 'vite';

export default defineConfig({
  // Specify the project root directory
  root: './',
  
  // Set the base public path when served in production
  base: '/',
  
  // Configure the build output
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  
  // Development server options
  server: {
    port: 3000,
    open: true,
  },
  
  // Resolve module aliases
  resolve: {
    alias: {
      // Add aliases if needed
      // '@': '/src',
    },
  },
}); 