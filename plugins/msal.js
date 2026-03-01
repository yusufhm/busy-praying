import { PublicClientApplication } from '@azure/msal-browser'
import { OutlookProvider } from '@/integrations/calendar/OutlookProvider'
import { GoogleProvider } from '@/integrations/calendar/GoogleProvider'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: config.public.msalClientId,
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: 'localStorage',
    },
  })

  nuxtApp.provide('calendarProviders', {
    outlook: new OutlookProvider(msalInstance),
    google: new GoogleProvider(),
  })
})
