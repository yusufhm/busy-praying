import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    start: {},
    end: {},
  }),

  actions: {
    setStartEnd({ start, end }) {
      if (start && this.start !== start) this.start = start
      if (end && this.end !== end) this.end = end
    },
  },
})
