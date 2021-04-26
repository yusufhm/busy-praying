<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
    <v-autocomplete
      v-model="country"
      :items="countries"
      :rules="[(v) => !!v || 'Country is required']"
      label="Country"
      required
    ></v-autocomplete>

    <v-autocomplete
      v-if="country"
      v-model="city"
      :items="cities"
      :rules="[(v) => !!v || 'City is required']"
      label="City"
      required
    ></v-autocomplete>
    <v-btn class="mr-4" type="submit" :disabled="!valid">Save</v-btn>
  </v-form>
</template>
<script>
import csc from 'country-state-city'
export default {
  data: () => ({
    valid: true,
    country: '',
    city: '',
  }),
  computed: {
    countries: () => {
      return csc.getAllCountries().map(({ name, isoCode }) => {
        return { text: name, value: isoCode }
      })
    },
    cities: (state) => {
      if (!state.country) return []
      return csc.getCitiesOfCountry(state.country).map(({ name }) => {
        return { text: name, value: name }
      })
    },
  },
  watch: {
    country: {
      async handler(value, oldValue) {
        const storeValue = await this.$store.getters['prayertimes/getCountry']
        if (value !== storeValue) {
          this.city = ''
        } else {
          this.city = await this.$store.getters['prayertimes/getCity']
        }
      },
    },
  },
  async mounted() {
    this.country = await this.$store.getters['prayertimes/getCountry']
    this.city = await this.$store.getters['prayertimes/getCity']
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      if (this.valid) {
        this.$store.commit('prayertimes/setCountry', this.country)
        this.$store.commit('prayertimes/setCity', this.city)
      }
    },
  },
}
</script>
