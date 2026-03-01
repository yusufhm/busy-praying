<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title :text="title" />
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
