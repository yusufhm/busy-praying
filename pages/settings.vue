<template>
  <v-form ref="form" @submit.prevent="submit">
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

    <v-btn class="mr-4" type="submit">Save</v-btn>
  </v-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Country, City } from 'country-state-city'
import { usePrayertimesStore } from '@/stores/prayertimes'

const store = usePrayertimesStore()
const form = ref(null)
const country = ref('')
const city = ref('')

const countries = computed(() =>
  Country.getAllCountries().map(({ name, isoCode }) => ({
    title: name,
    value: isoCode,
  }))
)

const cities = computed(() => {
  if (!country.value) return []
  return City.getCitiesOfCountry(country.value).map(({ name }) => ({
    title: name,
    value: name,
  }))
})

watch(country, (value) => {
  if (value !== store.country) {
    city.value = ''
  } else {
    city.value = store.city
  }
})

onMounted(() => {
  country.value = store.country
  city.value = store.city
})

async function submit() {
  const { valid } = await form.value.validate()
  if (valid) {
    store.setCountry(country.value)
    store.setCity(city.value)
  }
}
</script>
