import { createPinia, setActivePinia } from 'pinia'
import { useCalendarStore } from '@/stores/calendar'

describe('calendar store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('has empty start and end objects', () => {
      const store = useCalendarStore()
      expect(store.start).toEqual({})
      expect(store.end).toEqual({})
    })
  })

  describe('setStartEnd action', () => {
    it('updates start and end when they differ from current values', () => {
      const store = useCalendarStore()
      const start = { year: 2024, month: 3 }
      const end = { year: 2024, month: 3 }
      store.setStartEnd({ start, end })
      expect(store.start).toEqual(start)
      expect(store.end).toEqual(end)
    })

    it('keeps start value when the same object is passed again', () => {
      const store = useCalendarStore()
      const start = { year: 2024, month: 3 }
      store.start = start
      store.setStartEnd({ start, end: null })
      expect(store.start).toStrictEqual(start)
    })

    it('keeps end value when the same object is passed again', () => {
      const store = useCalendarStore()
      const end = { year: 2024, month: 3 }
      store.end = end
      store.setStartEnd({ start: null, end })
      expect(store.end).toStrictEqual(end)
    })

    it('leaves start unchanged when a falsy start is passed', () => {
      const store = useCalendarStore()
      store.start = { year: 2023 }
      store.setStartEnd({ start: null, end: null })
      expect(store.start).toEqual({ year: 2023 })
    })

    it('leaves end unchanged when a falsy end is passed', () => {
      const store = useCalendarStore()
      store.end = { year: 2023 }
      store.setStartEnd({ start: null, end: undefined })
      expect(store.end).toEqual({ year: 2023 })
    })
  })
})
