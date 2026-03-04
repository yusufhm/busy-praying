import { PublicClientApplication } from '@azure/msal-browser'
import { OutlookProvider } from '@/integrations/calendar/OutlookProvider'
import { GoogleProvider } from '@/integrations/calendar/GoogleProvider'

export default defineNuxtPlugin({
  enforce: 'post',
  async setup(nuxtApp) {
    const config = useRuntimeConfig()

    const msalInstance = new PublicClientApplication({
      auth: {
        clientId: config.public.msalClientId,
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: window.location.origin + '/settings',
      },
      cache: {
        cacheLocation: 'localStorage',
        // Store PKCE/state data in localStorage so the popup window (which has
        // its own sessionStorage) can access it during the auth code exchange.
        temporaryCacheLocation: 'localStorage',
      },
    })

    // Must be called on every page load (including inside the popup window)
    // so that MSAL can process redirect responses and clear stale interaction locks.
    await msalInstance.initialize()

    // If running inside the MSAL popup redirect window, initialize() has already
    // processed the auth response and signalled the opener. Nothing else to do —
    // the popup will close itself. Continuing would risk overwriting store state.
    if (window.opener && window.opener !== window) {
      return
    }

    const outlookProvider = new OutlookProvider(msalInstance)

    // Restore the MSAL account from its own cache so the provider is ready
    // to make API calls without requiring the user to log in again.
    const { useCalendarSyncStore } = await import('@/stores/calendarSync')
    const syncStore = useCalendarSyncStore()
    const storedAccountId = syncStore.providers.outlook.accountId

    if (storedAccountId) {
      const account = msalInstance.getAccount({ homeAccountId: storedAccountId })
      if (account) {
        outlookProvider.restoreAccount(account)
      } else {
        // MSAL has no account for this ID — the session has expired.
        syncStore.setDisconnected('outlook')
      }
    }

    nuxtApp.provide('calendarProviders', {
      outlook: outlookProvider,
      google: new GoogleProvider(),
    })
  },
})
