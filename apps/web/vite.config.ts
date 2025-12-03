import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { execSync } from 'child_process';

const isElectronBuild = process.env.ELECTRON_BUILD === 'true';

// Csomag meghatározása: először environment változóból, majd git branch nevéből, végül default 'full'
function getActivePackage(): string {
  // 1. Próbáljuk az environment változóból
  if (process.env.VITE_ACTIVE_PACKAGE) {
    return process.env.VITE_ACTIVE_PACKAGE;
  }
  
  // 2. Próbáljuk a git branch nevéből (build-time)
  try {
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    console.log('[Vite Config] Git branch:', gitBranch);
    
    // Branch nevek -> package nevek mapping
    if (gitBranch === 'package-1' || gitBranch === 'package-2' || gitBranch === 'package-3' || gitBranch === 'package-4' || gitBranch === 'package-5') {
      return gitBranch;
    }
    if (gitBranch === 'main' || gitBranch === 'master') {
      return 'full';
    }
  } catch (error) {
    // Ha nem sikerül a git parancs (pl. nincs git vagy nem git repo), akkor folytatjuk
    console.log('[Vite Config] Could not determine git branch, using default');
  }
  
  // 3. Default érték
  return 'full';
}

const activePackage = getActivePackage();

// Debug log a build során
console.log('[Vite Config] VITE_ACTIVE_PACKAGE from env:', process.env.VITE_ACTIVE_PACKAGE);
console.log('[Vite Config] Active package (determined):', activePackage);

export default defineConfig(({ mode }) => {
  return {
    base: isElectronBuild ? './' : '/',
    define: {
      // Build-time változó beállítása
      'import.meta.env.VITE_ACTIVE_PACKAGE': JSON.stringify(activePackage),
    },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mbit ERP',
        short_name: 'Mbit ERP',
        description: 'Modular enterprise application for MB-IT Kft.',
        theme_color: '#1E1E1E',
        icons: [
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
  };
});
