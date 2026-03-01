import { defineStore } from 'pinia'

export const usePrayertimesStore = defineStore('prayertimes', {
  state: () => ({
    times: {},
    city: '',
    country: '',
  }),

  getters: {
    getCountry: (state) => state.country,
    getCity: (state) => state.city,
    getTimes: (state) => (start) => {
      if (!state.country || !state.city) return []
      const key = `${state.country}-${state.city}-${start.year}-${start.month}`
      return state.times[key] ?? []
    },
  },

  actions: {
    setCountry(country) {
      this.country = country
    },
    setCity(city) {
      this.city = city
    },
    // fetchFn is passed in so the action is testable without Nuxt
    async fetchTimes(start, fetchFn) {
      if (!this.country || !this.city) return
      const key = `${this.country}-${this.city}-${start.year}-${start.month}`
      if (this.times[key]?.length) return
      const times = await fetchFn({
        city: this.city,
        country: this.country,
        method: 2,
        month: start.month,
        year: start.year,
      })
      this.times[key] = times
    },
  },

  persist: true,
})
