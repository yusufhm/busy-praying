import { defineStore } from 'pinia'

export const useCalendarSyncStore = defineStore('calendarSync', {
  state: () => ({
    providers: {
      outlook: { connected: false, accountId: null },
      google: { connected: false, accountId: null },
    },
    // Maps event key → { outlook: graphEventId, google: gcalEventId }
    // Key format: "{country}-{city}-{year}-{month}-{prayerName}-{readableDate}"
    eventIds: {},
    lastSyncedAt: null,
    lastSyncCount: 0,
  }),

  getters: {
    isConnected: (state) => (provider) =>
      state.providers[provider]?.connected ?? false,

    connectedProviders: (state) =>
      Object.keys(state.providers).filter((p) => state.providers[p].connected),
  },

  actions: {
    setConnected(provider, accountId) {
      if (!this.providers[provider]) return
      this.providers[provider].connected = true
      this.providers[provider].accountId = accountId
    },

    setDisconnected(provider) {
      if (!this.providers[provider]) return
      this.providers[provider].connected = false
      this.providers[provider].accountId = null
    },

    setEventId(key, provider, eventId) {
      if (!this.eventIds[key]) this.eventIds[key] = {}
      this.eventIds[key][provider] = eventId
    },

    getEventId(key, provider) {
      return this.eventIds[key]?.[provider] ?? null
    },

    clearEventIds(provider) {
      for (const key of Object.keys(this.eventIds)) {
        if (this.eventIds[key]) {
          delete this.eventIds[key][provider]
        }
      }
    },

    recordSync(count) {
      this.lastSyncedAt = new Date().toISOString()
      this.lastSyncCount = count
    },
  },

  persist: true,
})
