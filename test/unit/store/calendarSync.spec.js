import { createPinia, setActivePinia } from 'pinia'
import { useCalendarSyncStore } from '@/stores/calendarSync'

describe('calendarSync store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('has outlook and google providers disconnected', () => {
      const store = useCalendarSyncStore()
      expect(store.providers.outlook).toStrictEqual({
        connected: false,
        accountId: null,
      })
      expect(store.providers.google).toStrictEqual({
        connected: false,
        accountId: null,
      })
    })

    it('has empty eventIds', () => {
      const store = useCalendarSyncStore()
      expect(store.eventIds).toEqual({})
    })

    it('has null lastSyncedAt and zero lastSyncCount', () => {
      const store = useCalendarSyncStore()
      expect(store.lastSyncedAt).toBeNull()
      expect(store.lastSyncCount).toBe(0)
    })
  })

  describe('getters', () => {
    it('isConnected returns false for disconnected provider', () => {
      const store = useCalendarSyncStore()
      expect(store.isConnected('outlook')).toBe(false)
    })

    it('isConnected returns true after connecting', () => {
      const store = useCalendarSyncStore()
      store.setConnected('outlook', 'acc-123')
      expect(store.isConnected('outlook')).toBe(true)
    })

    it('isConnected returns false for unknown provider', () => {
      const store = useCalendarSyncStore()
      expect(store.isConnected('yahoo')).toBe(false)
    })

    it('connectedProviders lists only connected providers', () => {
      const store = useCalendarSyncStore()
      store.setConnected('outlook', 'acc-123')
      expect(store.connectedProviders).toEqual(['outlook'])
    })

    it('connectedProviders is empty when none connected', () => {
      const store = useCalendarSyncStore()
      expect(store.connectedProviders).toEqual([])
    })
  })

  describe('actions', () => {
    it('setConnected updates provider state', () => {
      const store = useCalendarSyncStore()
      store.setConnected('outlook', 'acc-123')
      expect(store.providers.outlook.connected).toBe(true)
      expect(store.providers.outlook.accountId).toBe('acc-123')
    })

    it('setConnected ignores unknown providers', () => {
      const store = useCalendarSyncStore()
      expect(() => store.setConnected('yahoo', 'acc-x')).not.toThrow()
    })

    it('setDisconnected clears provider state', () => {
      const store = useCalendarSyncStore()
      store.setConnected('outlook', 'acc-123')
      store.setDisconnected('outlook')
      expect(store.providers.outlook.connected).toBe(false)
      expect(store.providers.outlook.accountId).toBeNull()
    })

    it('setEventId stores the event ID for a provider', () => {
      const store = useCalendarSyncStore()
      store.setEventId('key-1', 'outlook', 'AAMk...')
      expect(store.eventIds['key-1'].outlook).toBe('AAMk...')
    })

    it('getEventId returns null when key does not exist', () => {
      const store = useCalendarSyncStore()
      expect(store.getEventId('missing', 'outlook')).toBeNull()
    })

    it('getEventId returns stored event ID', () => {
      const store = useCalendarSyncStore()
      store.setEventId('key-1', 'outlook', 'AAMk...')
      expect(store.getEventId('key-1', 'outlook')).toBe('AAMk...')
    })

    it('clearEventIds removes provider entries from all keys', () => {
      const store = useCalendarSyncStore()
      store.setEventId('key-1', 'outlook', 'AAMk...')
      store.setEventId('key-2', 'outlook', 'BBMk...')
      store.clearEventIds('outlook')
      expect(store.eventIds['key-1'].outlook).toBeUndefined()
      expect(store.eventIds['key-2'].outlook).toBeUndefined()
    })

    it('recordSync updates lastSyncedAt and lastSyncCount', () => {
      const store = useCalendarSyncStore()
      store.recordSync(5)
      expect(store.lastSyncedAt).not.toBeNull()
      expect(store.lastSyncCount).toBe(5)
    })
  })
})
