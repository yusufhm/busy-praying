import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    reducer: (state) => ({
      prayertimes: { ...state.prayertimes },
    }),
  }).plugin(store)
}
