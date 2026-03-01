<template>
  <div>
    <p v-if="lastSyncedAt" class="text-body-2 mb-0">
      Last synced {{ formattedDate }} &mdash; {{ lastSyncCount }}
      {{ lastSyncCount === 1 ? 'event' : 'events' }}
    </p>
    <p v-else class="text-body-2 text-medium-emphasis mb-0">Not yet synced</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCalendarSyncStore } from '@/stores/calendarSync'

const syncStore = useCalendarSyncStore()

const lastSyncedAt = computed(() => syncStore.lastSyncedAt)
const lastSyncCount = computed(() => syncStore.lastSyncCount)

const formattedDate = computed(() => {
  if (!lastSyncedAt.value) return null
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(lastSyncedAt.value))
})
</script>
