import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'service-worker.js',
      manifest: {
        "name": "Twitter-like app by Ana",
        "short_name": "Twitter",
        "start_url": ".",
        "icons": [
          {
            "src": "/icons/icon_144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "/icons/icon_475.png",
            "sizes": "475x475",
            "type": "image/png"
          }
        ],
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
        "id": "2025-twitter-like"
      }
    })
  ]
})