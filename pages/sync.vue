<template>
  <v-row>
    <v-col cols="12">
      <h1 class="text-h5 mb-2">Calendar Sync</h1>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Connect your calendar to create events for your prayer times automatically.
      </p>
    </v-col>

    <v-col v-for="p in providerDefs" :key="p.provider" cols="12" sm="6">
      <ProviderCard
        :provider="p.provider"
        :label="p.label"
        :icon="p.icon"
        :coming-soon="p.comingSoon"
      />
    </v-col>

    <template v-if="anyConnected">
      <v-col cols="12">
        <v-alert v-if="!locationSet" type="warning">
          Please configure your city and country in
          <NuxtLink to="/settings">Settings</NuxtLink> before syncing.
        </v-alert>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title>Sync prayer times</v-card-title>
          <v-card-text>
            <v-select
              v-model="syncScope"
              :items="scopeOptions"
              label="Sync range"
              variant="outlined"
              density="compact"
              class="mb-4"
              style="max-width: 280px"
            />

            <SyncSummary />

            <v-alert v-if="syncError" type="error" density="compact" class="mt-4">
              {{ syncError }}
            </v-alert>
            <v-alert v-if="syncResult !== null" type="success" density="compact" class="mt-4">
              Synced {{ syncResult }} {{ syncResult === 1 ? 'event' : 'events' }}.
            </v-alert>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              variant="flat"
              :loading="syncing"
              :disabled="!locationSet"
              prepend-icon="mdi-calendar-sync"
              @click="handleSync"
            >
              Sync now
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCalendarSyncStore } from '@/stores/calendarSync'
import { usePrayertimesStore } from '@/stores/prayertimes'
import { useCalendarSync } from '@/composables/useCalendarSync'
import ProviderCard from '@/components/CalendarSync/ProviderCard.vue'
import SyncSummary from '@/components/CalendarSync/SyncSummary.vue'

useHead({ title: 'Sync' })

const syncStore = useCalendarSyncStore()
const prayertimesStore = usePrayertimesStore()
const { sync } = useCalendarSync()

const providerDefs = [
  {
    provider: 'outlook',
    label: 'Outlook / Microsoft 365',
    icon: 'mdi-microsoft-outlook',
    comingSoon: false,
  },
  {
    provider: 'google',
    label: 'Google Calendar',
    icon: 'mdi-google',
    comingSoon: true,
  },
]

const scopeOptions = [
  { title: 'Current month', value: 1 },
  { title: 'Next 3 months', value: 3 },
  { title: 'Next 6 months', value: 6 },
]

const syncScope = ref(1)
const syncing = ref(false)
const syncError = ref(null)
const syncResult = ref(null)

const anyConnected = computed(() => syncStore.connectedProviders.length > 0)
const locationSet = computed(
  () => !!prayertimesStore.country && !!prayertimesStore.city,
)

function buildMonths(count) {
  const months = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }
  return months
}

async function handleSync() {
  syncing.value = true
  syncError.value = null
  syncResult.value = null
  try {
    const months = buildMonths(syncScope.value)
    const { $alAdhanFetchPrayerTimes } = useNuxtApp()
    for (const m of months) {
      await prayertimesStore.fetchTimes(m, $alAdhanFetchPrayerTimes)
    }
    syncResult.value = await sync(months)
  } catch (e) {
    syncError.value = e.message
  } finally {
    syncing.value = false
  }
}
</script>
