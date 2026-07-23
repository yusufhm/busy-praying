<template>
  <v-app :theme="effectiveTheme">
    <v-app-bar app>
      <v-toolbar-title>
        <div class="d-flex align-center ga-2">
          <img src="/logo.svg" alt="" height="32" width="32" />
          <span class="app-title">{{ title }}</span>
        </div>
      </v-toolbar-title>
      <v-spacer />
      <v-btn to="/calendar" variant="text">Calendar</v-btn>
      <v-btn to="/sync" variant="text">Sync</v-btn>
      <v-btn to="/settings" variant="text">Settings</v-btn>
      <v-btn to="/help" variant="text">Help</v-btn>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const title = 'Busy Praying'
const themeStore = useThemeStore()
const systemDark = ref(false)

const effectiveTheme = computed(() =>
  themeStore.preference === 'system'
    ? (systemDark.value ? 'dark' : 'light')
    : themeStore.preference
)

let mediaQuery = null

function onSystemThemeChange(e) {
  systemDark.value = e.matches
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onSystemThemeChange)
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', onSystemThemeChange)
})
</script>

<style scoped>
.app-title {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  letter-spacing: 0.06em;
  font-size: 1.1rem;
}
</style>
