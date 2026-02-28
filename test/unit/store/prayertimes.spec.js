import { state, getters, mutations, actions } from '@/store/prayertimes'

describe('prayertimes store', () => {
  describe('state', () => {
    it('returns default state', () => {
      const s = state()
      expect(s.times).toEqual({})
      expect(s.city).toBe('')
      expect(s.country).toBe('')
    })
  })

  describe('getters', () => {
    it('getCountry returns the country', () => {
      const s = { country: 'GB' }
      expect(getters.getCountry(s)).toBe('GB')
    })

    it('getCity returns the city', () => {
      const s = { city: 'London' }
      expect(getters.getCity(s)).toBe('London')
    })

    it('getTimes returns [] when country is missing', () => {
      const s = { ...state(), city: 'London' }
      expect(getters.getTimes(s)({ year: 2024, month: 1 }, {})).toEqual([])
    })

    it('getTimes returns [] when city is missing', () => {
      const s = { ...state(), country: 'GB' }
      expect(getters.getTimes(s)({ year: 2024, month: 1 }, {})).toEqual([])
    })

    it('getTimes returns [] when no cached entry exists for the key', () => {
      const s = { ...state(), country: 'GB', city: 'London' }
      expect(getters.getTimes(s)({ year: 2024, month: 1 }, {})).toEqual([])
    })

    it('getTimes returns cached times for matching key', () => {
      const mockTimes = [{ date: { readable: '1 Jan 2024' }, timings: {} }]
      const s = {
        country: 'GB',
        city: 'London',
        times: { 'GB-London-2024-1': mockTimes },
      }
      const result = getters.getTimes(s)({ year: 2024, month: 1 }, {})
      expect(result).toEqual(mockTimes)
    })
  })

  describe('mutations', () => {
    it('setCountry updates country', () => {
      const s = state()
      mutations.setCountry(s, 'US')
      expect(s.country).toBe('US')
    })

    it('setCity updates city', () => {
      const s = state()
      mutations.setCity(s, 'New York')
      expect(s.city).toBe('New York')
    })

    it('setTimes stores times under the given key', () => {
      const s = state()
      const mockTimes = [{ date: {}, timings: {} }]
      mutations.setTimes(s, { key: 'US-New York-2024-3', times: mockTimes })
      expect(s.times['US-New York-2024-3']).toEqual(mockTimes)
    })

    it('setTimes does not overwrite other cached keys', () => {
      const s = state()
      const firstBatch = [{ date: {}, timings: {} }]
      const secondBatch = [{ date: {}, timings: {} }, { date: {}, timings: {} }]
      mutations.setTimes(s, { key: 'GB-London-2024-1', times: firstBatch })
      mutations.setTimes(s, { key: 'GB-London-2024-2', times: secondBatch })
      expect(s.times['GB-London-2024-1']).toEqual(firstBatch)
      expect(s.times['GB-London-2024-2']).toEqual(secondBatch)
    })
  })

  describe('actions', () => {
    it('fetchTimes returns early when country is missing', async () => {
      const commit = jest.fn()
      const s = { ...state(), city: 'London' }
      await actions.fetchTimes.call({}, { commit, state: s }, { year: 2024, month: 1 })
      expect(commit).not.toHaveBeenCalled()
    })

    it('fetchTimes returns early when city is missing', async () => {
      const commit = jest.fn()
      const s = { ...state(), country: 'GB' }
      await actions.fetchTimes.call({}, { commit, state: s }, { year: 2024, month: 1 })
      expect(commit).not.toHaveBeenCalled()
    })

    it('fetchTimes skips API call when times are already cached', async () => {
      const mockTimes = [{ date: {}, timings: {} }]
      const s = {
        country: 'GB',
        city: 'London',
        times: { 'GB-London-2024-1': mockTimes },
      }
      const commit = jest.fn()
      const alAdhanFetchPrayerTimes = jest.fn()
      await actions.fetchTimes.call(
        { $alAdhanFetchPrayerTimes: alAdhanFetchPrayerTimes },
        { commit, state: s },
        { year: 2024, month: 1 }
      )
      expect(alAdhanFetchPrayerTimes).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })

    it('fetchTimes calls API and commits times when not cached', async () => {
      const mockTimes = [{ date: {}, timings: {} }]
      const s = { country: 'GB', city: 'London', times: {} }
      const commit = jest.fn()
      const alAdhanFetchPrayerTimes = jest.fn().mockResolvedValue(mockTimes)
      await actions.fetchTimes.call(
        { $alAdhanFetchPrayerTimes: alAdhanFetchPrayerTimes },
        { commit, state: s },
        { year: 2024, month: 1 }
      )
      expect(alAdhanFetchPrayerTimes).toHaveBeenCalledWith({
        city: 'London',
        country: 'GB',
        method: 2,
        month: 1,
        year: 2024,
      })
      expect(commit).toHaveBeenCalledWith('setTimes', {
        key: 'GB-London-2024-1',
        times: mockTimes,
      })
    })
  })
})
