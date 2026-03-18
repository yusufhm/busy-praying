<template>
  <div>
  <v-card class="mb-6">
    <v-card-title>Theme</v-card-title>
    <v-card-text>
      <v-btn-toggle v-model="themeStore.preference" mandatory color="primary">
        <v-btn value="light">
          <v-icon start>mdi-weather-sunny</v-icon>
          Light
        </v-btn>
        <v-btn value="dark">
          <v-icon start>mdi-weather-night</v-icon>
          Dark
        </v-btn>
        <v-btn value="system">
          <v-icon start>mdi-theme-light-dark</v-icon>
          System
        </v-btn>
      </v-btn-toggle>
    </v-card-text>
  </v-card>

  <v-card class="mb-6">
    <v-card-title>Prayer Colours</v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          v-for="prayer in prayers"
          :key="prayer"
          cols="12"
          sm="6"
          md="4"
        >
          <div class="d-flex align-center ga-3">
            <span class="text-body-1">{{ prayer }}</span>
            <v-btn
              :color="store.prayerColors[prayer]"
              size="small"
              variant="flat"
              rounded
              @click="openColorPicker(prayer)"
            >
              <v-icon>mdi-palette</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog v-model="colorPickerOpen" max-width="320">
    <v-card>
      <v-card-title>{{ editingPrayer }} Colour</v-card-title>
      <v-card-text class="d-flex justify-center">
        <v-color-picker
          v-model="editingColor"
          :modes="['hex']"
          hide-inputs
        ></v-color-picker>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="colorPickerOpen = false">Cancel</v-btn>
        <v-btn color="primary" variant="text" @click="saveColor">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Country, City } from 'country-state-city'
import { usePrayertimesStore } from '@/stores/prayertimes'
import { useThemeStore } from '@/stores/theme'
import { SYNC_TIMINGS } from '@/utils/prayerTimings'

const store = usePrayertimesStore()
const themeStore = useThemeStore()
const form = ref(null)
const country = ref('')
const city = ref('')

const prayers = [...SYNC_TIMINGS]

const colorPickerOpen = ref(false)
const editingPrayer = ref('')
const editingColor = ref('')

function openColorPicker(prayer) {
  editingPrayer.value = prayer
  editingColor.value = store.prayerColors[prayer]
  colorPickerOpen.value = true
}

function saveColor() {
  store.setPrayerColor(editingPrayer.value, editingColor.value)
  colorPickerOpen.value = false
}

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
