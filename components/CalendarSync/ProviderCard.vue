<template>
  <v-card>
    <v-card-title class="d-flex align-center ga-2">
      <v-icon :icon="icon" />
      {{ label }}
      <v-chip v-if="comingSoon" size="small" color="grey" class="ml-1">
        Coming soon
      </v-chip>
    </v-card-title>

    <v-card-text>
      <v-alert v-if="error" type="error" density="compact" class="mb-0">
        {{ error }}
      </v-alert>
      <span v-else-if="connected" class="text-success">
        <v-icon size="small">mdi-check-circle</v-icon>
        Connected
      </span>
      <span v-else class="text-medium-emphasis">Not connected</span>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="!connected"
        :disabled="comingSoon || loading"
        :loading="loading"
        color="primary"
        variant="flat"
        @click="handleConnect"
      >
        Connect
      </v-btn>
      <v-btn
        v-else
        :loading="loading"
        color="error"
        variant="outlined"
        @click="handleDisconnect"
      >
        Disconnect
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCalendarSyncStore } from '@/stores/calendarSync'
import { useCalendarSync } from '@/composables/useCalendarSync'

const props = defineProps({
  provider: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  comingSoon: { type: Boolean, default: false },
})

const syncStore = useCalendarSyncStore()
const { connect, disconnect } = useCalendarSync()

const loading = ref(false)
const error = ref(null)

const connected = computed(() => syncStore.isConnected(props.provider))

async function handleConnect() {
  loading.value = true
  error.value = null
  try {
    await connect(props.provider)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleDisconnect() {
  loading.value = true
  error.value = null
  try {
    await disconnect(props.provider)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
