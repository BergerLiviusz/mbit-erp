import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

const isElectronBuild = process.env.ELECTRON_BUILD === 'true';
// Csomag meghatározása environment változóból vagy default 'full'
// Vite automatikusan elérhetővé teszi a VITE_ prefixű változókat import.meta.env-ben
const activePackage = process.env.VITE_ACTIVE_PACKAGE || 'full';

// Debug log a build során
console.log('[Vite Config] VITE_ACTIVE_PACKAGE from env:', process.env.VITE_ACTIVE_PACKAGE);
console.log('[Vite Config] Active package:', activePackage);

export default defineConfig(({ mode }) => {
  // A Vite automatikusan elérhetővé teszi a VITE_ prefixű environment változókat
  // De biztosítjuk, hogy ha nincs beállítva, akkor a define segítségével beállítjuk
  const packageValue = process.env.VITE_ACTIVE_PACKAGE || activePackage;
  
  return {
    base: isElectronBuild ? './' : '/',
    define: {
      // Build-time változó beállítása - a Vite automatikusan kezeli a VITE_ prefixű változókat,
      // de a define biztosítja, hogy mindig legyen érték (akár undefined is)
      'import.meta.env.VITE_ACTIVE_PACKAGE': JSON.stringify(packageValue),
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
