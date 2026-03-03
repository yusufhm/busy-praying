<template>
  <v-row justify="center">
    <v-col cols="12" md="8">
      <h1 class="text-h5 mb-2">Help</h1>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Everything you need to know about using Busy Praying.
      </p>

      <v-expansion-panels variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-rocket-launch-outline</v-icon>
            Getting started
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="mb-3">Follow these three steps to get up and running:</p>
            <ol class="pl-4">
              <li class="mb-2">
                <strong>Set your location</strong> — go to
                <NuxtLink to="/settings">Settings</NuxtLink> and choose your
                country and city. This tells the app which prayer times to
                fetch.
              </li>
              <li class="mb-2">
                <strong>View your prayer times</strong> — open the
                <NuxtLink to="/calendar">Calendar</NuxtLink> to browse prayer
                times by day, week, or month.
              </li>
              <li class="mb-2">
                <strong>Sync to your calendar (optional)</strong> — go to
                <NuxtLink to="/sync">Sync</NuxtLink> to push prayer times
                directly into your Outlook or Microsoft 365 calendar as events.
              </li>
            </ol>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-clock-outline</v-icon>
            Prayer times
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="mb-3">
              Busy Praying shows the five daily prayers for your chosen
              location. Times are sourced from the
              <a
                href="https://aladhan.com/prayer-times-api"
                target="_blank"
                rel="noopener"
              >
                Al Adhan Prayer Times API
              </a>
              and are updated each month.
            </p>
            <p class="mb-3">The following prayers are included:</p>
            <v-list density="compact" class="mb-2">
              <v-list-item
                prepend-icon="mdi-weather-night"
                title="Fajr"
                subtitle="Pre-dawn prayer"
              />
              <v-list-item
                prepend-icon="mdi-weather-sunny"
                title="Dhuhr"
                subtitle="Midday prayer"
              />
              <v-list-item
                prepend-icon="mdi-weather-partly-cloudy"
                title="Asr"
                subtitle="Afternoon prayer"
              />
              <v-list-item
                prepend-icon="mdi-weather-sunset"
                title="Maghrib"
                subtitle="Sunset prayer"
              />
              <v-list-item
                prepend-icon="mdi-moon-waning-crescent"
                title="Isha"
                subtitle="Night prayer"
              />
            </v-list>
            <p class="text-medium-emphasis text-body-2">
              Sunrise, Sunset, Imsak, and Midnight are not included as prayer
              events.
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-microsoft-outlook</v-icon>
            Calendar sync
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="mb-3">
              Connecting Outlook lets Busy Praying create prayer time events
              directly in your Microsoft 365 or Outlook calendar — no manual
              entry needed.
            </p>
            <p class="mb-3">
              <strong>What permission is requested?</strong>
              The app requests <code>Calendars.ReadWrite</code> access. In plain
              language, this allows Busy Praying to create, update, and remove
              the prayer time events <em>it manages</em>. Your existing calendar
              events are never read, changed, or deleted.
            </p>
            <p class="mb-3"><strong>What do the events look like?</strong></p>
            <ul class="pl-4 mb-3">
              <li>
                Each event is named after the prayer (e.g. <em>Fajr</em>,
                <em>Dhuhr</em>)
              </li>
              <li>
                Events are 15 minutes long, starting at the exact prayer time
              </li>
              <li>They appear in your default calendar</li>
            </ul>
            <p>
              To review or revoke the app's access to your Microsoft account at
              any time, visit
              <a
                href="https://myapps.microsoft.com"
                target="_blank"
                rel="noopener"
                >myapps.microsoft.com</a
              >.
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-calendar-sync</v-icon>
            Syncing &amp; re-syncing
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="mb-3">
              When you press <strong>Sync now</strong>, Busy Praying fetches the
              latest prayer times for your chosen range and pushes them to your
              connected calendar.
            </p>
            <ul class="pl-4 mb-3">
              <li class="mb-1">
                <strong>Current month</strong> — syncs prayer times for this
                month only
              </li>
              <li class="mb-1">
                <strong>Next 3 months</strong> — syncs this month and the two
                following
              </li>
              <li class="mb-1">
                <strong>Next 6 months</strong> — syncs this month and the five
                following
              </li>
            </ul>
            <p>
              Re-syncing is safe — existing events are updated in place rather
              than duplicated. You can sync as often as you like.
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-link-off</v-icon>
            Disconnecting
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="mb-3">
              When you disconnect from Outlook, you will be asked what to do
              with your previously-synced events:
            </p>
            <ul class="pl-4 mb-3">
              <li class="mb-2">
                <strong>Disconnect only</strong> — your Microsoft account is
                unlinked and Busy Praying can no longer sync, but all prayer
                time events remain in your calendar.
              </li>
              <li class="mb-2">
                <strong>Disconnect &amp; delete events</strong> — all prayer
                time events created by Busy Praying are permanently removed from
                your calendar before the account is unlinked.
                <em>This cannot be undone.</em>
              </li>
            </ul>
            <p>
              You can reconnect at any time and sync again — events will be
              recreated from scratch.
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-shield-lock-outline</v-icon>
            Your data &amp; privacy
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="mb-3">
              Busy Praying is a client-side app — there is no Busy Praying
              server. Everything runs in your browser.
            </p>
            <p class="mb-3"><strong>What is stored on your device:</strong></p>
            <ul class="pl-4 mb-3">
              <li class="mb-1">Your chosen city and country</li>
              <li class="mb-1">Cached prayer times fetched from Al Adhan</li>
              <li class="mb-1">
                Outlook event IDs (used to update events without creating
                duplicates)
              </li>
            </ul>
            <p class="mb-3"><strong>What is never stored or shared:</strong></p>
            <ul class="pl-4 mb-3">
              <li class="mb-1">Your calendar contents or event details</li>
              <li class="mb-1">Your Microsoft account credentials or tokens</li>
              <li class="mb-1">
                Any personal data beyond the location you enter
              </li>
            </ul>
            <p>
              Prayer times are fetched directly from
              <a href="https://aladhan.com" target="_blank" rel="noopener"
                >aladhan.com</a
              >. To manage Microsoft app permissions, visit
              <a
                href="https://myapps.microsoft.com"
                target="_blank"
                rel="noopener"
                >myapps.microsoft.com</a
              >.
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3">mdi-wrench-outline</v-icon>
            Troubleshooting
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list lines="two">
              <v-list-item
                title="Sign-in popup was blocked"
                subtitle="Allow popups for this site in your browser settings, then try connecting again."
                prepend-icon="mdi-window-restore"
              />
              <v-divider />
              <v-list-item
                title="Sync button is disabled"
                subtitle="You need to set your city and country in Settings before syncing."
                prepend-icon="mdi-map-marker-off"
              />
              <v-divider />
              <v-list-item
                title="Events are not appearing in Outlook"
                subtitle="Try pressing Sync now again. If the problem persists, disconnect and reconnect your account."
                prepend-icon="mdi-calendar-alert"
              />
              <v-divider />
              <v-list-item
                title="I see an authentication error"
                subtitle="Your session may have expired. Disconnect and reconnect your Outlook account, then sync again."
                prepend-icon="mdi-account-alert"
              />
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script setup>
useHead({ title: 'Help' })
</script>
