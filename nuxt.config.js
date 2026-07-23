import { copyFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Copy the MSAL v5 redirect bridge bundle into public/ so the popup redirect
// page (public/auth-redirect.html) can load it as a static asset.
const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  copyFileSync(
    resolve(__dirname, 'node_modules/@azure/msal-browser/lib/redirect-bridge/msal-redirect-bridge.min.js'),
    resolve(__dirname, 'public/msal-redirect-bridge.min.js'),
  )
} catch {}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      titleTemplate: '%s - Busy Praying',
      title: 'Busy Praying',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap' },
      ],
    },
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
  ],

  build: {
    transpile: ['vuetify'],
  },

  runtimeConfig: {
    public: {
      // Set NUXT_PUBLIC_MSAL_CLIENT_ID in your environment to enable Outlook sync
      msalClientId: '',
    },
  },

  modules: ['@pinia/nuxt'],

  devServer: {
    host: '0.0.0.0',
  },

  compatibilityDate: '2024-11-01',
})
