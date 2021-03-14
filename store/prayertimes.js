export const state = () => ({
  times: [],
})

export const mutations = {
  setTimes(state, times) {
    state.times = times
  },
}

export const actions = {
  async fetchTimes({ commit }) {
    const times = await this.$axios.$get(
      'https://api.aladhan.com/v1/calendarByCity?city=Wetherill%20Park&country=AU&method=2&month=03&year=2021'
    )
    commit('setTimes', times.data)
  },
}
