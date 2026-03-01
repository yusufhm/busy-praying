import { createPinia, setActivePinia } from 'pinia'
import { usePrayertimesStore } from '@/stores/prayertimes'

describe('prayertimes store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('has empty times, city and country', () => {
      const store = usePrayertimesStore()
      expect(store.times).toEqual({})
      expect(store.city).toBe('')
      expect(store.country).toBe('')
    })
  })

  describe('getters', () => {
    it('getCountry returns current country', () => {
      const store = usePrayertimesStore()
      store.country = 'GB'
      expect(store.getCountry).toBe('GB')
    })

    it('getCity returns current city', () => {
      const store = usePrayertimesStore()
      store.city = 'London'
      expect(store.getCity).toBe('London')
    })

    it('getTimes returns [] when country is not set', () => {
      const store = usePrayertimesStore()
      store.city = 'London'
      expect(store.getTimes({ year: 2024, month: 1 })).toEqual([])
    })

    it('getTimes returns [] when city is not set', () => {
      const store = usePrayertimesStore()
      store.country = 'GB'
      expect(store.getTimes({ year: 2024, month: 1 })).toEqual([])
    })

    it('getTimes returns [] when key not in cache', () => {
      const store = usePrayertimesStore()
      store.country = 'GB'
      store.city = 'London'
      expect(store.getTimes({ year: 2024, month: 1 })).toEqual([])
    })

    it('getTimes returns cached times for matching key', () => {
      const store = usePrayertimesStore()
      store.country = 'GB'
      store.city = 'London'
      const mockTimes = [{ date: { readable: '1 Jan 2024' }, timings: {} }]
      store.times['GB-London-2024-1'] = mockTimes
      expect(store.getTimes({ year: 2024, month: 1 })).toEqual(mockTimes)
    })
  })

  describe('actions', () => {
    it('setCountry updates country', () => {
      const store = usePrayertimesStore()
      store.setCountry('US')
      expect(store.country).toBe('US')
    })

    it('setCity updates city', () => {
      const store = usePrayertimesStore()
      store.setCity('New York')
      expect(store.city).toBe('New York')
    })

    it('fetchTimes returns early when country is missing', async () => {
      const store = usePrayertimesStore()
      store.city = 'London'
      const fetchFn = jest.fn()
      await store.fetchTimes({ year: 2024, month: 1 }, fetchFn)
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('fetchTimes returns early when city is missing', async () => {
      const store = usePrayertimesStore()
      store.country = 'GB'
      const fetchFn = jest.fn()
      await store.fetchTimes({ year: 2024, month: 1 }, fetchFn)
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('fetchTimes skips API call when data is already cached', async () => {
      const store = usePrayertimesStore()
      store.country = 'GB'
      store.city = 'London'
      store.times['GB-London-2024-1'] = [{ date: {}, timings: {} }]
      const fetchFn = jest.fn()
      await store.fetchTimes({ year: 2024, month: 1 }, fetchFn)
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('fetchTimes calls fetchFn and caches results when not cached', async () => {
      const store = usePrayertimesStore()
      store.country = 'GB'
      store.city = 'London'
      const mockTimes = [{ date: {}, timings: {} }]
      const fetchFn = jest.fn().mockResolvedValue(mockTimes)
      await store.fetchTimes({ year: 2024, month: 1 }, fetchFn)
      expect(fetchFn).toHaveBeenCalledWith({
        city: 'London',
        country: 'GB',
        method: 2,
        month: 1,
        year: 2024,
      })
      expect(store.times['GB-London-2024-1']).toEqual(mockTimes)
    })

    it('fetchTimes does not overwrite an existing cache entry for a different month', async () => {
      const store = usePrayertimesStore()
      store.country = 'GB'
      store.city = 'London'
      const jan = [{ date: {}, timings: {} }]
      store.times['GB-London-2024-1'] = jan
      const feb = [{ date: {}, timings: {} }, { date: {}, timings: {} }]
      const fetchFn = jest.fn().mockResolvedValue(feb)
      await store.fetchTimes({ year: 2024, month: 2 }, fetchFn)
      expect(store.times['GB-London-2024-1']).toEqual(jan)
      expect(store.times['GB-London-2024-2']).toEqual(feb)
    })
  })
})
