<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title :text="title" />
      <v-spacer />
      <v-btn to="/calendar" variant="text">Calendar</v-btn>
      <v-btn to="/sync" variant="text">Sync</v-btn>
      <v-btn to="/settings" variant="text">Settings</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script setup>
const title = 'Busy Praying'
</script>
