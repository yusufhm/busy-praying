/**
 * The set of prayer timings to include when syncing or displaying on the
 * calendar. Any timing returned by the Al Adhan API that is not in this set
 * (e.g. Sunrise, Sunset, Imsak, Midnight, Firstthird, Lastthird) is ignored.
 */
export const SYNC_TIMINGS = new Set(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'])
