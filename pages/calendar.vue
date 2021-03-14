<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>
      <v-select
        v-model="mode"
        :items="modes"
        dense
        outlined
        hide-details
        label="event-overlap-mode"
        class="ma-2"
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        dense
        outlined
        hide-details
        label="weekdays"
        class="ma-2"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="value"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @change="getEvents"
      ></v-calendar>
    </v-sheet>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  data: () => ({
    type: 'month',
    types: ['month', 'week', 'day', '4day'],
    mode: 'stack',
    modes: ['stack', 'column'],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: '',
    events: [],
    colors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1',
    ],
  }),
  computed: {
    times() {
      return this.$store.state.prayertimes.times
    },
  },
  mounted() {
    const { start, end } = this.$store.state.calendar
    this.fetchTimes().then(() => {
      this.getEvents({ start, end })
    })
  },
  methods: {
    getEvents({ start, end }) {
      this.setStartEnd({ start, end })
      const events = []
      if (!this.times.length) {
        return
      }

      for (let i = 0; i < this.times.length; i++) {
        const date = this.times[i].date.readable
        Object.keys(this.times[i].timings).forEach((name) => {
          const fullDate = `${date} ${this.times[i].timings[name]}`
          const fullDateTimestamp = Date.parse(fullDate)
          events.push({
            name,
            start: fullDateTimestamp,
            end: fullDateTimestamp + 15 * 60 * 1000,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: true,
          })
        })
      }

      this.events = events
    },
    getEventColor(event) {
      return event.color
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    ...mapActions({
      fetchTimes: 'prayertimes/fetchTimes',
    }),
    ...mapMutations({
      setStartEnd: 'calendar/setStartEnd',
    }),
  },
}
</script>
