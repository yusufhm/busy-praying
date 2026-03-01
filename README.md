# busy-praying

A prayer times SPA built with Nuxt 3, Vuetify 3, and Pinia. Fetches daily prayer times via the [Al Adhan API](https://aladhan.com/prayer-times-api) based on the user's configured city and country. Syncs those times to your Outlook or Google Calendar as recurring events.

## Tech Stack

- **[Nuxt 3](https://nuxt.com)** — SSR-disabled, static-target SPA
- **[Vuetify 3](https://vuetifyjs.com)** — UI component library (Material Design)
- **[Pinia](https://pinia.vuejs.org)** with `pinia-plugin-persistedstate` — state management
- **[Al Adhan API](https://aladhan.com/prayer-times-api)** — prayer times data source
- **[country-state-city](https://www.npmjs.com/package/country-state-city)** — country/city selection
- **[@azure/msal-browser](https://github.com/AzureAD/microsoft-authentication-library-for-js)** — Microsoft identity / Outlook Calendar auth

## Setup

```bash
# ChromeDriver downloads are blocked in some environments; skip them if needed
CHROMEDRIVER_SKIP_DOWNLOAD=true npm install --legacy-peer-deps
```

## Development

```bash
npm install --legacy-peer-deps

# Serve with hot reload at localhost:3000
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NUXT_PUBLIC_MSAL_CLIENT_ID` | For Outlook sync | Azure AD application (client) ID |

Create a `.env` file at the project root:

```
NUXT_PUBLIC_MSAL_CLIENT_ID=your-azure-client-id-here
```

## Testing

### Unit Tests (Jest)

Unit tests cover Pinia stores, calendar provider integrations, and the sync
composable. They run in Node and require no browser or network access.

```bash
npm run test:unit
```

Coverage is collected from `stores/`, `plugins/`, `integrations/`, and
`composables/`. A full report is written to `coverage/`.

#### Test layout

```
test/unit/
├── store/
│   ├── calendar.spec.js          — calendar store
│   ├── calendarSync.spec.js      — calendarSync store (auth state + event ID map)
│   └── prayertimes.spec.js       — prayertimes store
├── integrations/
│   ├── BaseCalendarProvider.spec.js — abstract interface contract
│   ├── OutlookProvider.spec.js      — Graph API calls (MSAL + $fetch mocked)
│   └── GoogleProvider.spec.js       — stub throws correct errors
└── composables/
    └── useCalendarSync.spec.js      — connect / disconnect / sync logic
```

### E2E Tests (Nightwatch + ChromeDriver)

E2E tests require a running dev server and Chrome. Run them in two terminals:

```bash
# Terminal 1 — start the dev server
npm run dev

# Terminal 2 — run E2E tests
npm run test:e2e
```

If `npm install` fails due to a blocked ChromeDriver download, skip it:

```bash
CHROMEDRIVER_SKIP_DOWNLOAD=true npm install --legacy-peer-deps
```

Then point Nightwatch at a manually installed ChromeDriver or a running
ChromeDriver service by editing `nightwatch.conf.js`.

## Linting

```bash
# JS + Vue linting (ESLint)
npm run lint:js

# CSS linting (Stylelint)
npm run lint:style

# Run all linters
npm run lint
```

## Outlook Calendar Sync — Local Setup

To test the Outlook sync feature you need an Azure AD application registration.

1. **Register an app** in [Azure Portal](https://portal.azure.com) →
   Microsoft Entra ID → App registrations → New registration.

2. **Redirect URI** — add `http://localhost:3000` as a
   *Single-page application* redirect URI.

3. **API permissions** — add the delegated permission
   `Calendars.ReadWrite` (Microsoft Graph).

4. **Copy the client ID** from the app's Overview page and set it in `.env`:
   ```
   NUXT_PUBLIC_MSAL_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

5. Start the dev server (`npm run dev`), navigate to **/sync**, and click
   **Connect** under "Outlook / Microsoft 365". A Microsoft login popup will
   appear.

> **Note:** No client secret is needed. The app uses the PKCE auth-code flow
> via MSAL.js, which is safe for browser SPAs without a backend.

## Google Calendar Sync — Coming Soon

The `GoogleProvider` stub in `integrations/calendar/GoogleProvider.js`
documents the implementation path. When ready:

1. Register a project in [Google Cloud Console](https://console.cloud.google.com).
2. Enable the **Google Calendar API**.
3. Create an OAuth 2.0 client ID (Web application type) and add
   `http://localhost:3000` as an authorised redirect URI.
4. Implement `GoogleProvider` using Google Identity Services (GIS) and the
   Calendar REST API (see comments in the stub file).
