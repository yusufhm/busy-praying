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
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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

  nitro: {
    publicAssets: [
      {
        // Serve the MSAL v5 redirect bridge bundle as a static asset.
        // The popup redirect page (public/auth-redirect.html) loads it directly
        // so the popup can broadcast the auth code back to the opener window.
        dir: 'node_modules/@azure/msal-browser/lib/redirect-bridge',
        baseURL: '/',
      },
    ],
  },

  devServer: {
    host: '0.0.0.0',
  },

  compatibilityDate: '2024-11-01',
})
