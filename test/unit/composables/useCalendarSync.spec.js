import { createPinia, setActivePinia } from 'pinia'
import { useCalendarSyncStore } from '@/stores/calendarSync'
import { usePrayertimesStore } from '@/stores/prayertimes'
import { useCalendarSync } from '@/composables/useCalendarSync'

// ----------------------------------------------------------------------------
// Fixtures
// ----------------------------------------------------------------------------

// One day of Al Adhan API data covering all five daily prayers plus the four
// timings the app deliberately skips (Sunrise, Sunset, Imsak, Midnight).
const MOCK_TIMES = [
  {
    date: { readable: '01 Mar 2026' },
    timings: {
      Fajr: '05:30',
      Sunrise: '07:00', // skipped
      Dhuhr: '12:45',
      Asr: '16:20',
      Sunset: '18:30', // skipped
      Maghrib: '18:45',
      Isha: '20:15',
      Imsak: '05:20', // skipped
      Midnight: '00:30', // skipped
    },
  },
]

// Expected number of synced events: 9 timings − 4 skipped = 5
const EXPECTED_EVENT_COUNT = 5

// ----------------------------------------------------------------------------
// Mocks
// ----------------------------------------------------------------------------

const mockOutlook = {
  connect: jest.fn().mockResolvedValue('acc-outlook-123'),
  disconnect: jest.fn().mockResolvedValue(undefined),
  createEvent: jest.fn().mockResolvedValue('graph-evt-001'),
  updateEvent: jest.fn().mockResolvedValue(undefined),
  deleteEvent: jest.fn().mockResolvedValue(undefined),
}

const mockGoogle = {
  connect: jest.fn(),
  disconnect: jest.fn(),
}

// useNuxtApp is a Nuxt global auto-import — expose it in the Node test env
global.useNuxtApp = jest.fn(() => ({
  $calendarProviders: { outlook: mockOutlook, google: mockGoogle },
}))

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function setupConnectedStore(country = 'GB', city = 'London') {
  const syncStore = useCalendarSyncStore()
  syncStore.setConnected('outlook', 'acc-outlook-123')

  const prayertimesStore = usePrayertimesStore()
  prayertimesStore.setCountry(country)
  prayertimesStore.setCity(city)
  prayertimesStore.times[`${country}-${city}-2026-3`] = MOCK_TIMES

  return { syncStore, prayertimesStore }
}

// ----------------------------------------------------------------------------
// Tests
// ----------------------------------------------------------------------------

describe('useCalendarSync', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // --------------------------------------------------------------------------
  describe('connect()', () => {
    it('calls provider.connect() and marks the provider as connected', async () => {
      const { connect } = useCalendarSync()
      await connect('outlook')

      expect(mockOutlook.connect).toHaveBeenCalled()
      expect(useCalendarSyncStore().isConnected('outlook')).toBe(true)
    })

    it('stores the account ID returned by the provider', async () => {
      const { connect } = useCalendarSync()
      await connect('outlook')

      expect(useCalendarSyncStore().providers.outlook.accountId).toBe(
        'acc-outlook-123',
      )
    })

    it('throws for an unrecognised provider name', async () => {
      const { connect } = useCalendarSync()
      await expect(connect('yahoo')).rejects.toThrow('Unknown provider: yahoo')
    })
  })

  // --------------------------------------------------------------------------
  describe('disconnect()', () => {
    it('calls provider.disconnect() and marks the provider as disconnected', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')

      const { disconnect } = useCalendarSync()
      await disconnect('outlook')

      expect(mockOutlook.disconnect).toHaveBeenCalled()
      expect(syncStore.isConnected('outlook')).toBe(false)
    })

    it('clears all stored event IDs for the provider', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')
      syncStore.setEventId('key-1', 'outlook', 'graph-evt-001')
      syncStore.setEventId('key-2', 'outlook', 'graph-evt-002')

      const { disconnect } = useCalendarSync()
      await disconnect('outlook')

      expect(syncStore.eventIds['key-1']?.outlook).toBeUndefined()
      expect(syncStore.eventIds['key-2']?.outlook).toBeUndefined()
    })

    it('throws for an unrecognised provider name', async () => {
      const { disconnect } = useCalendarSync()
      await expect(disconnect('yahoo')).rejects.toThrow(
        'Unknown provider: yahoo',
      )
    })

    it('does not call deleteEvent by default (no cleanup)', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')
      syncStore.setEventId('key-1', 'outlook', 'graph-evt-001')

      const { disconnect } = useCalendarSync()
      await disconnect('outlook')

      expect(mockOutlook.deleteEvent).not.toHaveBeenCalled()
    })

    it('with cleanup: true calls deleteEvent for each stored event ID', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')
      syncStore.setEventId('key-1', 'outlook', 'graph-evt-001')
      syncStore.setEventId('key-2', 'outlook', 'graph-evt-002')

      const { disconnect } = useCalendarSync()
      await disconnect('outlook', { cleanup: true })

      expect(mockOutlook.deleteEvent).toHaveBeenCalledTimes(2)
      expect(mockOutlook.deleteEvent).toHaveBeenCalledWith('graph-evt-001')
      expect(mockOutlook.deleteEvent).toHaveBeenCalledWith('graph-evt-002')
    })

    it('with cleanup: true still disconnects and clears IDs after deletion', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')
      syncStore.setEventId('key-1', 'outlook', 'graph-evt-001')

      const { disconnect } = useCalendarSync()
      await disconnect('outlook', { cleanup: true })

      expect(mockOutlook.disconnect).toHaveBeenCalled()
      expect(syncStore.isConnected('outlook')).toBe(false)
      expect(syncStore.eventIds['key-1']?.outlook).toBeUndefined()
    })

    it('with cleanup: true and no synced events does not call deleteEvent', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')

      const { disconnect } = useCalendarSync()
      await disconnect('outlook', { cleanup: true })

      expect(mockOutlook.deleteEvent).not.toHaveBeenCalled()
      expect(mockOutlook.disconnect).toHaveBeenCalled()
    })

    it('with cleanup: true only deletes events for the disconnected provider', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')
      // Simulate a key that has both an outlook and a google ID
      syncStore.setEventId('key-1', 'outlook', 'graph-evt-001')
      syncStore.setEventId('key-1', 'google', 'gcal-evt-001')

      const { disconnect } = useCalendarSync()
      await disconnect('outlook', { cleanup: true })

      expect(mockOutlook.deleteEvent).toHaveBeenCalledWith('graph-evt-001')
      expect(mockOutlook.deleteEvent).toHaveBeenCalledTimes(1)
    })
  })

  // --------------------------------------------------------------------------
  describe('sync()', () => {
    it('returns 0 when no providers are connected', async () => {
      const { sync } = useCalendarSync()
      const count = await sync([{ year: 2026, month: 3 }])
      expect(count).toBe(0)
      expect(mockOutlook.createEvent).not.toHaveBeenCalled()
    })

    it('returns 0 when city is not configured', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')
      usePrayertimesStore().setCountry('GB') // city intentionally omitted

      const { sync } = useCalendarSync()
      const count = await sync([{ year: 2026, month: 3 }])
      expect(count).toBe(0)
    })

    it('returns 0 when country is not configured', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')
      usePrayertimesStore().setCity('London') // country intentionally omitted

      const { sync } = useCalendarSync()
      const count = await sync([{ year: 2026, month: 3 }])
      expect(count).toBe(0)
    })

    it('returns 0 and skips a month whose prayer times are not cached', async () => {
      const syncStore = useCalendarSyncStore()
      syncStore.setConnected('outlook', 'acc-outlook-123')
      const prayertimesStore = usePrayertimesStore()
      prayertimesStore.setCountry('GB')
      prayertimesStore.setCity('London')
      // times cache intentionally empty

      const { sync } = useCalendarSync()
      const count = await sync([{ year: 2026, month: 3 }])
      expect(count).toBe(0)
    })

    it('creates one event per non-skipped prayer timing', async () => {
      setupConnectedStore()
      const { sync } = useCalendarSync()
      const count = await sync([{ year: 2026, month: 3 }])

      expect(count).toBe(EXPECTED_EVENT_COUNT)
      expect(mockOutlook.createEvent).toHaveBeenCalledTimes(EXPECTED_EVENT_COUNT)
      expect(mockOutlook.updateEvent).not.toHaveBeenCalled()
    })

    it('skips Sunrise, Sunset, Imsak, and Midnight timings', async () => {
      setupConnectedStore()
      const { sync } = useCalendarSync()
      await sync([{ year: 2026, month: 3 }])

      const titles = mockOutlook.createEvent.mock.calls.map(([e]) => e.title)
      expect(titles).not.toContain('Sunrise')
      expect(titles).not.toContain('Sunset')
      expect(titles).not.toContain('Imsak')
      expect(titles).not.toContain('Midnight')
    })

    it('stores the event ID returned by createEvent', async () => {
      const { syncStore } = setupConnectedStore()
      const { sync } = useCalendarSync()
      await sync([{ year: 2026, month: 3 }])

      // At least one key should map to the mocked event ID
      const storedIds = Object.values(syncStore.eventIds).map(
        (m) => m.outlook,
      )
      expect(storedIds).toContain('graph-evt-001')
    })

    it('calls updateEvent (not createEvent) when an event ID is already stored', async () => {
      const { syncStore } = setupConnectedStore()
      const fajrKey = 'GB-London-2026-3-Fajr-01 Mar 2026'
      syncStore.setEventId(fajrKey, 'outlook', 'existing-graph-id')

      const { sync } = useCalendarSync()
      await sync([{ year: 2026, month: 3 }])

      expect(mockOutlook.updateEvent).toHaveBeenCalledWith(
        'existing-graph-id',
        expect.objectContaining({ title: 'Fajr' }),
      )
      // Only the remaining 4 prayers are created fresh
      expect(mockOutlook.createEvent).toHaveBeenCalledTimes(
        EXPECTED_EVENT_COUNT - 1,
      )
    })

    it('records the sync timestamp and total event count', async () => {
      const { syncStore } = setupConnectedStore()
      const { sync } = useCalendarSync()
      await sync([{ year: 2026, month: 3 }])

      expect(syncStore.lastSyncedAt).not.toBeNull()
      expect(syncStore.lastSyncCount).toBe(EXPECTED_EVENT_COUNT)
    })

    it('accumulates counts across multiple months', async () => {
      const { prayertimesStore } = setupConnectedStore()
      // Add a second month of data
      prayertimesStore.times['GB-London-2026-4'] = MOCK_TIMES

      const { sync } = useCalendarSync()
      const count = await sync([
        { year: 2026, month: 3 },
        { year: 2026, month: 4 },
      ])

      expect(count).toBe(EXPECTED_EVENT_COUNT * 2)
    })

    it('passes the correct event shape to the provider', async () => {
      setupConnectedStore()
      const { sync } = useCalendarSync()
      await sync([{ year: 2026, month: 3 }])

      const fajrCall = mockOutlook.createEvent.mock.calls.find(
        ([e]) => e.title === 'Fajr',
      )
      expect(fajrCall).toBeDefined()
      const [fajrEvent] = fajrCall
      expect(fajrEvent.start).toBeInstanceOf(Date)
      expect(fajrEvent.end).toBeInstanceOf(Date)
      // end should be 15 minutes after start
      expect(fajrEvent.end - fajrEvent.start).toBe(15 * 60 * 1000)
      expect(typeof fajrEvent.key).toBe('string')
      expect(fajrEvent.key).toContain('Fajr')
    })
  })
})
