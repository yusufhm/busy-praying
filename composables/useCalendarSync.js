import { useCalendarSyncStore } from '@/stores/calendarSync'
import { usePrayertimesStore } from '@/stores/prayertimes'

const SKIP_TIMINGS = new Set(['Midnight', 'Imsak', 'Sunrise', 'Sunset'])

/**
 * Builds the canonical dedup key for a single prayer event.
 * Format: "{country}-{city}-{year}-{month}-{prayerName}-{readableDate}"
 */
function buildKey(country, city, year, month, prayerName, readableDate) {
  return `${country}-${city}-${year}-${month}-${prayerName}-${readableDate}`
}

/**
 * Converts Al Adhan API data for one month into normalised CalendarEvent
 * objects ready to be passed to any BaseCalendarProvider.
 *
 * @param {Array}  times    - Raw API response array for one month
 * @param {string} country
 * @param {string} city
 * @param {number} year
 * @param {number} month
 * @returns {import('@/integrations/calendar/BaseCalendarProvider').CalendarEvent[]}
 */
function toCalendarEvents(times, country, city, year, month) {
  const events = []
  for (const day of times) {
    const readableDate = day.date.readable
    for (const [name, timeStr] of Object.entries(day.timings)) {
      if (SKIP_TIMINGS.has(name)) continue
      const ts = Date.parse(`${readableDate} ${timeStr}`)
      events.push({
        title: name,
        start: new Date(ts),
        end: new Date(ts + 15 * 60 * 1000),
        key: buildKey(country, city, year, month, name, readableDate),
      })
    }
  }
  return events
}

export function useCalendarSync() {
  const syncStore = useCalendarSyncStore()
  const prayertimesStore = usePrayertimesStore()
  const { $calendarProviders } = useNuxtApp()

  /**
   * Connect a calendar provider via its OAuth flow.
   * @param {'outlook'|'google'} providerName
   */
  async function connect(providerName) {
    const provider = $calendarProviders[providerName]
    if (!provider) throw new Error(`Unknown provider: ${providerName}`)
    const accountId = await provider.connect()
    syncStore.setConnected(providerName, accountId)
  }

  /**
   * Disconnect a provider and clear its stored event ID mappings.
   * @param {'outlook'|'google'} providerName
   */
  async function disconnect(providerName) {
    const provider = $calendarProviders[providerName]
    if (!provider) throw new Error(`Unknown provider: ${providerName}`)
    await provider.disconnect()
    syncStore.setDisconnected(providerName)
    syncStore.clearEventIds(providerName)
  }

  /**
   * Sync prayer times for the given months to all connected providers.
   * Creates new events or updates existing ones based on stored event IDs.
   *
   * @param {Array<{year: number, month: number}>} months
   * @returns {Promise<number>} Total number of events synced
   */
  async function sync(months) {
    const { country, city } = prayertimesStore
    const connectedProviders = syncStore.connectedProviders

    if (!connectedProviders.length || !country || !city) return 0

    let totalSynced = 0

    for (const { year, month } of months) {
      const times = prayertimesStore.getTimes({ year, month })
      if (!times.length) continue

      const events = toCalendarEvents(times, country, city, year, month)

      for (const providerName of connectedProviders) {
        const provider = $calendarProviders[providerName]
        for (const event of events) {
          const existingId = syncStore.getEventId(event.key, providerName)
          if (existingId) {
            await provider.updateEvent(existingId, event)
          } else {
            const newId = await provider.createEvent(event)
            syncStore.setEventId(event.key, providerName, newId)
          }
          totalSynced++
        }
      }
    }

    syncStore.recordSync(totalSynced)
    return totalSynced
  }

  return { connect, disconnect, sync }
}
