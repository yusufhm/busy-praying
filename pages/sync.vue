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

      <v-col cols="12">
        <v-card>
          <v-card-title>Troubleshooting</v-card-title>
          <v-card-text>
            <p class="text-body-2 text-medium-emphasis mb-4">
              If your calendar has duplicate or outdated prayer events, you can delete all
              previously synced events and start fresh.
            </p>

            <v-alert v-if="deleteError" type="error" density="compact" class="mt-2">
              {{ deleteError }}
            </v-alert>
            <v-alert v-if="deleteResult !== null" type="success" density="compact" class="mt-2">
              Deleted {{ deleteResult }} {{ deleteResult === 1 ? 'event' : 'events' }}.
            </v-alert>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              variant="tonal"
              :loading="deleting"
              prepend-icon="mdi-delete-sweep"
              @click="handleDelete"
            >
              Delete synced events
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
const { sync, deleteAllSyncedEvents } = useCalendarSync()

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
  { title: 'Today', value: 'today' },
  { title: 'This week', value: 'week' },
  { title: 'Current month', value: 1 },
  { title: 'Next 3 months', value: 3 },
  { title: 'Next 6 months', value: 6 },
]

const syncScope = ref(1)
const syncing = ref(false)
const syncError = ref(null)
const syncResult = ref(null)

const deleting = ref(false)
const deleteError = ref(null)
const deleteResult = ref(null)

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

function buildScopeConfig(scope) {
  const now = new Date()
  const y = now.getFullYear()
  const mo = now.getMonth()
  const d = now.getDate()

  if (scope === 'today') {
    return {
      months: [{ year: y, month: mo + 1 }],
      dateFilter: { start: new Date(y, mo, d, 0, 0, 0), end: new Date(y, mo, d, 23, 59, 59) },
    }
  }

  if (scope === 'week') {
    const dow = now.getDay() // 0=Sun, 1=Mon, ...
    const mondayOffset = dow === 0 ? -6 : 1 - dow
    const monday = new Date(y, mo, d + mondayOffset, 0, 0, 0)
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59)
    const months = []
    const seen = new Set()
    for (let i = 0; i <= 6; i++) {
      const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)
      const key = `${day.getFullYear()}-${day.getMonth() + 1}`
      if (!seen.has(key)) {
        seen.add(key)
        months.push({ year: day.getFullYear(), month: day.getMonth() + 1 })
      }
    }
    return { months, dateFilter: { start: monday, end: sunday } }
  }

  return { months: buildMonths(scope), dateFilter: null }
}

async function handleDelete() {
  deleting.value = true
  deleteError.value = null
  deleteResult.value = null
  try {
    deleteResult.value = await deleteAllSyncedEvents()
  } catch (e) {
    deleteError.value = e.message
  } finally {
    deleting.value = false
  }
}

async function handleSync() {
  syncing.value = true
  syncError.value = null
  syncResult.value = null
  try {
    const { months, dateFilter } = buildScopeConfig(syncScope.value)
    const { $alAdhanFetchPrayerTimes } = useNuxtApp()
    for (const m of months) {
      await prayertimesStore.fetchTimes(m, $alAdhanFetchPrayerTimes)
    }
    syncResult.value = await sync(months, { dateFilter })
  } catch (e) {
    syncError.value = e.message
  } finally {
    syncing.value = false
  }
}
</script>
