import { state, mutations } from '@/store/calendar'

describe('calendar store', () => {
  describe('state', () => {
    it('returns default state with empty start and end objects', () => {
      const s = state()
      expect(s.start).toEqual({})
      expect(s.end).toEqual({})
    })
  })

  describe('mutations', () => {
    it('setStartEnd updates start when it differs from current value', () => {
      const s = state()
      const start = { year: 2024, month: 3, day: 1 }
      const end = { year: 2024, month: 3, day: 31 }
      mutations.setStartEnd(s, { start, end })
      expect(s.start).toEqual(start)
      expect(s.end).toEqual(end)
    })

    it('setStartEnd does not update start if value is the same reference', () => {
      const s = state()
      const start = { year: 2024, month: 3 }
      s.start = start
      mutations.setStartEnd(s, { start, end: null })
      expect(s.start).toBe(start)
    })

    it('setStartEnd does not update end if value is the same reference', () => {
      const s = state()
      const end = { year: 2024, month: 3 }
      s.end = end
      mutations.setStartEnd(s, { start: null, end })
      expect(s.end).toBe(end)
    })

    it('setStartEnd does not update start when start is falsy', () => {
      const s = state()
      s.start = { year: 2023 }
      mutations.setStartEnd(s, { start: null, end: null })
      expect(s.start).toEqual({ year: 2023 })
    })

    it('setStartEnd does not update end when end is falsy', () => {
      const s = state()
      s.end = { year: 2023 }
      mutations.setStartEnd(s, { start: null, end: undefined })
      expect(s.end).toEqual({ year: 2023 })
    })
  })
})
