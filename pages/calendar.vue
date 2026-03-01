<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn variant="outlined" class="mr-4 d-none d-sm-flex" color="grey-darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn icon size="small" variant="tonal" class="mr-2 d-flex d-sm-none" color="grey-darken-2" @click="setToday">
            <v-icon>mdi-calendar-today</v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text" color="grey-darken-2" @click="prev">
            <v-icon size="small">mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text" color="grey-darken-2" @click="next">
            <v-icon size="small">mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu>
            <template #activator="{ props }">
              <v-btn variant="outlined" color="grey-darken-2" v-bind="props">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon end>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item title="Day" @click="type = 'day'"></v-list-item>
              <v-list-item title="Week" @click="type = 'week'"></v-list-item>
              <v-list-item title="Month" @click="type = 'month'"></v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="600">
        <v-calendar
          v-model="focus"
          :events="events"
          :type="type"
          @click:event="showEvent"
          @click:day="({ date }) => viewDay(date)"
          @update:model-value="updateRange"
        ></v-calendar>

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          location="end"
        >
          <v-card color="grey-lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title>{{ selectedEvent.title }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-actions>
              <v-btn variant="text" color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { usePrayertimesStore } from '@/stores/prayertimes'
import { useCalendarStore } from '@/stores/calendar'

const prayertimesStore = usePrayertimesStore()
const calendarStore = useCalendarStore()
const { $alAdhanFetchPrayerTimes } = useNuxtApp()

const focus = ref('')
const type = ref('month')
const typeToLabel = { month: 'Month', week: 'Week', day: 'Day' }
const selectedEvent = ref({})
const selectedElement = ref(null)
const selectedOpen = ref(false)
const events = ref([])

const COLORS = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey-darken-1']
const SKIP_TIMINGS = new Set(['Midnight', 'Imsak', 'Sunrise', 'Sunset'])

const title = computed(() => {
  let d
  if (focus.value) {
    const [y, m] = focus.value.split('-').map(Number)
    d = new Date(y, m - 1, 1)
  } else {
    d = new Date()
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(d)
})

// Format a Date using its local calendar date, avoiding UTC-midnight shift from toISOString().
function toIsoDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function setToday() {
  focus.value = toIsoDate(new Date())
}

function navigate(delta) {
  let d
  if (focus.value) {
    const [y, m, dy] = focus.value.split('-').map(Number)
    d = new Date(y, m - 1, dy)
  } else {
    d = new Date()
  }
  if (type.value === 'month') d.setMonth(d.getMonth() + delta)
  else if (type.value === 'week') d.setDate(d.getDate() + delta * 7)
  else d.setDate(d.getDate() + delta)
  focus.value = toIsoDate(d)
}

function prev() {
  navigate(-1)
}
function next() {
  navigate(1)
}

function viewDay(date) {
  focus.value = date
  type.value = 'day'
}

function showEvent({ event, nativeEvent }) {
  const open = () => {
    selectedEvent.value = event
    selectedElement.value = nativeEvent?.target ?? null
    setTimeout(() => {
      selectedOpen.value = true
    }, 10)
  }
  if (selectedOpen.value) {
    selectedOpen.value = false
    setTimeout(open, 10)
  } else {
    open()
  }
  nativeEvent?.stopPropagation()
}

function rnd(a, b) {
  return Math.floor((b - a + 1) * Math.random()) + a
}

async function updateRange() {
  // Parse ISO date parts directly to avoid UTC-midnight shift on date-only strings
  // (new Date("2026-03-01") is UTC midnight, which is the wrong local date in UTC- zones).
  let year, month
  if (focus.value) {
    const parts = focus.value.split('-')
    year = parseInt(parts[0])
    month = parseInt(parts[1])
  } else {
    const now = new Date()
    year = now.getFullYear()
    month = now.getMonth() + 1
  }
  const start = { year, month }

  calendarStore.setStartEnd({ start, end: start })
  await prayertimesStore.fetchTimes(start, $alAdhanFetchPrayerTimes)

  const times = prayertimesStore.getTimes(start)
  if (!times.length) return

  const newEvents = []
  for (const day of times) {
    const gr = day.date.gregorian
    const yr = parseInt(gr.year)
    const mo = gr.month.number - 1  // Date constructor uses 0-indexed months
    const dy = parseInt(gr.day)
    for (const name of Object.keys(day.timings)) {
      if (SKIP_TIMINGS.has(name)) continue
      // Strip non-standard timezone suffix (e.g. " (IST)") before parsing.
      const timeStr = day.timings[name].replace(/\s*\(.*\)\s*$/, '')
      const [hours, minutes] = timeStr.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) continue
      const ts = new Date(yr, mo, dy, hours, minutes, 0).getTime()
      newEvents.push({
        title: name,
        start: new Date(ts),
        end: new Date(ts + 30 * 60 * 1000),
        color: COLORS[rnd(0, COLORS.length - 1)],
      })
    }
  }
  events.value = newEvents
}

watch(focus, updateRange)

onMounted(() => {
  setToday()
})
</script>
