import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    reducer: (state) => ({
      prayertimes: { times: state.prayertimes.times },
    }),
  }).plugin(store)
}
