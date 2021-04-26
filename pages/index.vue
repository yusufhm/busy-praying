<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          Welcome to the Busy Praying app
        </v-card-title>
        <v-card-text>
          <p>
            Busy Praying is an Islamic prayer-based calendar which allows you to
            add events around prayer times. As the prayer times vary throughout
            the year, the events' time are updated accordingly.
          </p>
          <p>
            The app uses the excellent
            <a href="https://aladhan.com/prayer-times-api">Prayer Times API</a>
            from aladhan.com.
          </p>
          <!-- <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              rel="noopener noreferrer"
              title="contribute"
            >
              issue board </a
            >.
          </p> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/calendar"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  components: {
    // Logo,
    // VuetifyLogo,
  },
}
</script>
