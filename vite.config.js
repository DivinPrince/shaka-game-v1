import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    postcss: './postcss.config.js',
  },
  // Specify the project root directory
  root: './',
  
  // Set the base public path when served in production
  base: '/',
  
  // Configure the build output
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Rollup specific options
    rollupOptions: {
      input: {
        main: './index.html',
        multi: './multi.html'
      }
    }
  },
  
  // Development server options
  server: {
    port: 3002,
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