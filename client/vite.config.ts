import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Automatically update the SW in the background when a new build ships.
      registerType: 'autoUpdate',

      // Assets to precache (shell + fonts are added automatically by Workbox).
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png'],

      // Web app manifest — controls how the PWA appears when installed.
      manifest: {
        name: 'Rezepte App',
        short_name: 'Rezepte',
        description: 'Unsere Familienrezepte — immer dabei',
        theme_color: '#4a6e3a',
        background_color: '#faf6ef',
        display: 'standalone',
        orientation: 'any',
        lang: 'de',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      // Workbox config: what gets cached and how.
      workbox: {
        // Precache all build output (JS, CSS, HTML).
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        runtimeCaching: [
          {
            // API responses: network-first so data is always fresh when online,
            // falls back to cache when offline.
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Google Fonts: cache-first, they're immutable.
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            // External images (recipe image_url links): stale-while-revalidate.
            urlPattern: /\.(png|jpg|jpeg|webp|svg)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
