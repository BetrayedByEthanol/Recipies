import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

const APP_ORIGIN = (process.env.VITE_APP_ORIGIN ?? 'https://recipes.example.com').replace(/\/$/, '');


export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png'],
      manifest: {
        name: 'Rezepte App',
        short_name: 'Rezepte',
        description: 'Unsere Familienrezepte — immer dabei',
        theme_color: '#4a6e3a',
        background_color: '#faf6ef',
        id: `${APP_ORIGIN}/`,
        start_url: `${APP_ORIGIN}/`,
        scope: `${APP_ORIGIN}/`,
        display: 'standalone',
        orientation: 'any',
        lang: 'de',
        icons: [
          { src: `${APP_ORIGIN}/pwa-192x192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${APP_ORIGIN}/pwa-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/api\//,
          /^\/manifest\.json$/,
          /^\/manifest\.webmanifest$/,
          /^\/sw\.js$/,
          /^\/workbox-.*\.js$/,
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(png|jpg|jpeg|webp|svg)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      // Resolves @recipes/shared -> shared/types.ts at build time
      '@recipes/shared': path.resolve(__dirname, '../shared/types.ts'),
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
