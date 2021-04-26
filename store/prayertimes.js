export const state = () => ({
  times: {},
  city: '',
  country: '',
})

export const getters = {
  getCountry: (state) => state.country,
  getCity: (state) => state.city,
  getTimes: (state) => (start, end) => {
    if (!state.country || !state.city) {
      return []
    }
    const key = `${state.country}-${state.city}-${start.year}-${start.month}`
    if (!(key in state.times)) {
      return []
    }
    return state.times[key]
  },
}

export const mutations = {
  setCountry(state, country) {
    state.country = country
  },
  setCity(state, city) {
    state.city = city
  },
  setTimes(state, { key, times }) {
    state.times[key] = times
  },
}

export const actions = {
  async fetchTimes({ commit, state }, start, end) {
    if (!state.country || !state.city) {
      return []
    }
    const key = `${state.country}-${state.city}-${start.year}-${start.month}`
    if (key in state.times && state.times[key].length) {
      return state.times[key]
    }
    const times = await this.$alAdhanFetchPrayerTimes({
      city: state.city,
      country: state.country,
      method: 2,
      month: start.month,
      year: start.year,
    })
    commit('setTimes', { key, times })
  },
}
