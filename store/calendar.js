export const state = () => ({
  start: {},
  end: {},
})

export const mutations = {
  setStartEnd(state, { start, end }) {
    if (start && state.start !== start) {
      state.start = start
    }
    if (end && state.end !== end) {
      state.end = end
    }
  },
}
