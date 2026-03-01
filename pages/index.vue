<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="text-h5">
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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" to="/calendar">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup></script>
