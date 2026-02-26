import { defineConfig } from 'vite';

export default defineConfig({
  // Base public path - use '/' for serving from domain root
  base: '/',
  
  // Build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for debugging in production
    sourcemap: false,
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  
  // Server options for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  
  // Preview server options
  preview: {
    port: 4173,
  },
});
