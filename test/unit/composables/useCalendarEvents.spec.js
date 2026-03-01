import { parseFocusDate, buildCalendarEvents } from '@/composables/useCalendarEvents'

// ----------------------------------------------------------------------------
// Fixtures
// ----------------------------------------------------------------------------

// One day of Al Adhan API data mirroring the real response shape.
// Five prayers should survive after the six skipped timings are removed.
const MOCK_DAY = {
  date: {
    gregorian: {
      year: '2026',
      month: { number: 3 },
      day: '01',
    },
  },
  timings: {
    Fajr: '05:34 (IST)',
    Sunrise: '06:51 (IST)',  // skipped
    Dhuhr: '12:27 (IST)',
    Asr: '15:50 (IST)',
    Sunset: '17:51 (IST)',   // skipped
    Maghrib: '17:51 (IST)',
    Isha: '19:17 (IST)',
    Imsak: '05:24 (IST)',    // skipped
    Midnight: '00:13 (IST)', // skipped
  },
}

const EXPECTED_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const SKIPPED_TIMINGS = ['Sunrise', 'Sunset', 'Imsak', 'Midnight', 'Firstthird', 'Lastthird']

// ----------------------------------------------------------------------------
// parseFocusDate
// ----------------------------------------------------------------------------

describe('parseFocusDate', () => {
  it('parses year and month from an ISO date string without UTC shift', () => {
    expect(parseFocusDate('2026-03-01')).toEqual({ year: 2026, month: 3 })
  })

  it('parses the last day of the year correctly', () => {
    expect(parseFocusDate('2026-12-31')).toEqual({ year: 2026, month: 12 })
  })

  it('parses a date at a month boundary that would shift under UTC parsing', () => {
    // "2026-03-01" parsed as UTC midnight is Feb 28 in UTC-5 — month must stay 3
    expect(parseFocusDate('2026-03-01').month).toBe(3)
  })

  it('falls back to the current month when passed an empty string', () => {
    const now = new Date()
    expect(parseFocusDate('')).toEqual({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    })
  })

  it('falls back to the current month when passed null', () => {
    const now = new Date()
    const result = parseFocusDate(null)
    expect(result.year).toBe(now.getFullYear())
    expect(result.month).toBe(now.getMonth() + 1)
  })
})

// ----------------------------------------------------------------------------
// buildCalendarEvents
// ----------------------------------------------------------------------------

describe('buildCalendarEvents', () => {
  describe('skipped timings', () => {
    it('omits Sunrise, Sunset, Imsak, Midnight, Firstthird and Lastthird', () => {
      const names = buildCalendarEvents([MOCK_DAY]).map((e) => e.name)
      SKIPPED_TIMINGS.forEach((t) => expect(names).not.toContain(t))
    })

    it('includes all five daily prayers', () => {
      const names = buildCalendarEvents([MOCK_DAY]).map((e) => e.name)
      EXPECTED_PRAYERS.forEach((p) => expect(names).toContain(p))
    })

    it('returns exactly five events for a standard day', () => {
      expect(buildCalendarEvents([MOCK_DAY])).toHaveLength(5)
    })
  })

  describe('event shape', () => {
    it('uses name (not title) for the prayer label', () => {
      buildCalendarEvents([MOCK_DAY]).forEach((e) => {
        expect(e.name).toBeDefined()
        expect(e.title).toBeUndefined()
      })
    })

    it('sets timed: true so VCalendar positions events on the time grid', () => {
      buildCalendarEvents([MOCK_DAY]).forEach((e) => {
        expect(e.timed).toBe(true)
      })
    })

    it('sets end 30 minutes after start', () => {
      buildCalendarEvents([MOCK_DAY]).forEach((e) => {
        expect(e.end - e.start).toBe(30 * 60 * 1000)
      })
    })

    it('assigns a non-empty color string to every event', () => {
      buildCalendarEvents([MOCK_DAY]).forEach((e) => {
        expect(typeof e.color).toBe('string')
        expect(e.color.length).toBeGreaterThan(0)
      })
    })
  })

  describe('timestamp construction', () => {
    it('builds start time from gregorian date parts (not readable string)', () => {
      const fajr = buildCalendarEvents([MOCK_DAY]).find((e) => e.name === 'Fajr')
      expect(fajr.start).toBeInstanceOf(Date)
      expect(fajr.start.getFullYear()).toBe(2026)
      expect(fajr.start.getMonth()).toBe(2)   // 0-indexed: March = 2
      expect(fajr.start.getDate()).toBe(1)
      expect(fajr.start.getHours()).toBe(5)
      expect(fajr.start.getMinutes()).toBe(34)
    })

    it('strips the timezone suffix before parsing', () => {
      // If stripping fails, times become NaN and all events are dropped
      expect(buildCalendarEvents([MOCK_DAY]).length).toBeGreaterThan(0)
    })

    it('strips timezone suffixes with varying bracket content', () => {
      const day = {
        date: MOCK_DAY.date,
        timings: { Fajr: '05:34 (GMT+5)', Dhuhr: '12:27 (UTC)' },
      }
      const events = buildCalendarEvents([day])
      expect(events).toHaveLength(2)
      expect(events[0].start.getHours()).toBe(5)
      expect(events[1].start.getHours()).toBe(12)
    })
  })

  describe('edge cases', () => {
    it('returns an empty array for an empty times list', () => {
      expect(buildCalendarEvents([])).toEqual([])
    })

    it('skips a timing with an unparseable time string', () => {
      const day = {
        date: MOCK_DAY.date,
        timings: { Fajr: 'invalid', Dhuhr: '12:27' },
      }
      const events = buildCalendarEvents([day])
      expect(events.map((e) => e.name)).toEqual(['Dhuhr'])
    })

    it('accumulates events across multiple days', () => {
      const day2 = {
        date: {
          gregorian: { year: '2026', month: { number: 3 }, day: '02' },
        },
        timings: { Fajr: '05:35', Dhuhr: '12:27' },
      }
      // 5 from MOCK_DAY + 2 from day2
      expect(buildCalendarEvents([MOCK_DAY, day2])).toHaveLength(7)
    })
  })
})
