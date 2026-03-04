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
      <template v-if="connected">
        <v-btn
          disabled
          color="success"
          variant="tonal"
          prepend-icon="mdi-check-circle"
        >
          Connected
        </v-btn>
        <v-btn
          :loading="loading"
          color="error"
          variant="text"
          @click="showDisconnectDialog = true"
        >
          Disconnect
        </v-btn>
      </template>
      <v-btn
        v-else
        :disabled="comingSoon || loading"
        :loading="loading"
        color="primary"
        variant="flat"
        @click="handleConnect"
      >
        Connect
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-dialog
    v-model="showDisconnectDialog"
    max-width="420"
    :persistent="loading"
  >
    <v-card>
      <v-card-title>Disconnect from {{ label }}?</v-card-title>
      <v-card-text>
        <template v-if="eventCount > 0">
          You have
          <strong
            >{{ eventCount }} prayer time
            {{ eventCount === 1 ? 'event' : 'events' }}</strong
          >
          synced to this calendar. Would you like to delete them too?
        </template>
        <template v-else> Are you sure you want to disconnect? </template>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="loading"
          variant="text"
          @click="showDisconnectDialog = false"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :loading="loading"
          variant="outlined"
          @click="handleDisconnect(false)"
        >
          Disconnect only
        </v-btn>
        <v-btn
          v-if="eventCount > 0"
          :loading="loading"
          color="error"
          variant="flat"
          @click="handleDisconnect(true)"
        >
          Disconnect &amp; delete events
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
const showDisconnectDialog = ref(false)

const connected = computed(() => syncStore.isConnected(props.provider))

const eventCount = computed(
  () =>
    Object.values(syncStore.eventIds).filter((ids) => ids[props.provider])
      .length,
)

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

async function handleDisconnect(cleanup) {
  loading.value = true
  error.value = null
  try {
    await disconnect(props.provider, { cleanup })
    showDisconnectDialog.value = false
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
