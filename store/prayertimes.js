export const state = () => ({
  times: {},
})

export const getters = {
  getTimes: (state) => (start, end) => {
    const key = `${start.year}-${start.month}`
    if (!(key in state.times)) {
      return []
    }
    return state.times[key]
  },
}

export const mutations = {
  setTimes(state, { key, times }) {
    state.times[key] = times
  },
}

export const actions = {
  async fetchTimes({ commit, state }, start, end) {
    const key = `${start.year}-${start.month}`
    if (key in state.times && state.times[key].length) {
      return state.times[key]
    }
    const times = await this.$alAdhanFetchPrayerTimes({
      city: 'Wetherill Park',
      country: 'AU',
      method: 2,
      month: start.month,
      year: start.year,
    })
    commit('setTimes', { key, times })
  },
}
