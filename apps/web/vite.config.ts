import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { APP_VERSION } from '../../packages/config/src/app-version';
import { resolvePackageId } from '../../packages/config/src/packages';

const isElectronBuild = process.env.ELECTRON_BUILD === 'true';

const BRANCH_PACKAGE_MAP: Record<string, string> = {
  'package-1': 'package-1',
  'package-2': 'package-2',
  'package-3': 'package-3',
  'package-4': 'package-4',
  'package-5': 'package-5',
  'package-hr': 'hr',
  'release/ginop-crm-dms-hr': 'ginop-crm-dms-hr',
  'release/full': 'full',
  'release/logistics': 'logistics',
  'release/hr': 'hr',
  'release/crm': 'crm',
  main: 'full',
  master: 'full',
};

function getActivePackage(): string {
  if (process.env.VITE_ACTIVE_PACKAGE) {
    return resolvePackageId(process.env.VITE_ACTIVE_PACKAGE);
  }
  try {
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    console.log('[Vite Config] Git branch:', gitBranch);
    if (BRANCH_PACKAGE_MAP[gitBranch]) {
      return resolvePackageId(BRANCH_PACKAGE_MAP[gitBranch]);
    }
  } catch {
    console.log('[Vite Config] Could not determine git branch, using default');
  }
  return 'full';
}

function getBuildSha(): string {
  if (process.env.VITE_BUILD_SHA) return process.env.VITE_BUILD_SHA;
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

const activePackage = getActivePackage();
const appVersion = process.env.VITE_APP_VERSION || APP_VERSION;
const buildSha = getBuildSha();
const buildDate = process.env.VITE_BUILD_DATE || new Date().toISOString();

console.log('[Vite Config] Active package:', activePackage);
console.log('[Vite Config] App version:', appVersion);

export default defineConfig(({ mode }) => {
  return {
    base: isElectronBuild ? './' : '/',
    define: {
      'import.meta.env.VITE_ACTIVE_PACKAGE': JSON.stringify(activePackage),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
      'import.meta.env.VITE_BUILD_SHA': JSON.stringify(buildSha),
      'import.meta.env.VITE_BUILD_DATE': JSON.stringify(buildDate),
      'import.meta.env.VITE_APP_ENV': JSON.stringify(process.env.VITE_APP_ENV || (process.env.NODE_ENV === 'production' ? 'production' : 'development')),
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
        '@mbit-erp/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      },
    },
  };
});
