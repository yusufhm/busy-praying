const COLORS = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey-darken-1']
const SKIP_TIMINGS = new Set(['Midnight', 'Imsak', 'Sunrise', 'Sunset'])

function rnd(a, b) {
  return Math.floor((b - a + 1) * Math.random()) + a
}

/**
 * Parse an ISO focus date string ("YYYY-MM-DD") into { year, month } using
 * local date parts.  Avoids the UTC-midnight shift that new Date("YYYY-MM-DD")
 * introduces, which can return the wrong month in UTC− timezones.
 */
export function parseFocusDate(focusStr) {
  if (focusStr) {
    const parts = focusStr.split('-')
    return { year: parseInt(parts[0]), month: parseInt(parts[1]) }
  }
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

/**
 * Convert an array of Al Adhan API day objects into VCalendar-ready events.
 *
 * Key requirements for this VCalendar build:
 *  - `name` (not `title`) is the property read by the eventName default.
 *  - `timed: true` is required — VCalendar treats Date/number inputs as
 *    "timedless" and falls back to event.timed for day-view positioning.
 *  - Timestamps are built from day.date.gregorian parts (not Date.parse on
 *    the human-readable string) for reliable cross-browser parsing.
 */
export function buildCalendarEvents(times) {
  const events = []
  for (const day of times) {
    const gr = day.date.gregorian
    const yr = parseInt(gr.year)
    const mo = gr.month.number - 1  // Date constructor uses 0-indexed months
    const dy = parseInt(gr.day)
    for (const name of Object.keys(day.timings)) {
      if (SKIP_TIMINGS.has(name)) continue
      // Strip non-standard timezone suffix (e.g. " (IST)") before parsing.
      const timeStr = day.timings[name].replace(/\s*\(.*\)\s*$/, '')
      const [hours, minutes] = timeStr.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) continue
      const ts = new Date(yr, mo, dy, hours, minutes, 0).getTime()
      events.push({
        name,
        start: new Date(ts),
        end: new Date(ts + 30 * 60 * 1000),
        color: COLORS[rnd(0, COLORS.length - 1)],
        timed: true,
      })
    }
  }
  return events
}

export function useCalendarEvents() {
  return { parseFocusDate, buildCalendarEvents }
}
