# CLAUDE.md

## Project Overview

Prayer times SPA. Nuxt 3 (SSR disabled), Vuetify 3, Pinia with persisted state. Fetches monthly prayer times from the Al Adhan API by city/country.

## Common Commands

```bash
# Development
npm run dev

# Build / generate
npm run build
npm run generate

# Unit tests
npm run test:unit

# E2E tests (requires Chrome)
npm run test:e2e

# Lint
npm run lint:js
npm run lint:style
npm run lint
```

## Key Architecture

| Path | Purpose |
|------|---------|
| `nuxt.config.js` | Nuxt 3 config — SSR off, Vuetify CSS, `@pinia/nuxt` module |
| `plugins/vuetify.js` | Registers Vuetify with all core components and directives |
| `plugins/aladhan.js` | Provides `$alAdhanFetchPrayerTimes` via `$fetch` |
| `plugins/pinia.js` | Registers `pinia-plugin-persistedstate` |
| `stores/prayertimes.js` | Pinia store — city/country settings + cached prayer times |
| `stores/calendar.js` | Pinia store — calendar date range |
| `layouts/default.vue` | App shell with `<slot />` for page content |
| `pages/` | `index.vue` (today's times), `calendar.vue`, `settings.vue` |
| `test/unit/` | Jest unit tests for Pinia stores |
| `test/e2e/` | Nightwatch E2E tests |

## Notes for Development

- **npm install**: ChromeDriver downloads are blocked in some environments. Use `CHROMEDRIVER_SKIP_DOWNLOAD=true npm install --legacy-peer-deps` if the install hangs.
- **Pinia state in tests**: Pinia wraps state in reactive proxies — use `toStrictEqual` instead of `toBe` when comparing store state objects in Jest.
- **`fetchTimes` action**: Accepts a `fetchFn` parameter so it can be tested without a Nuxt context (pass a mock function in unit tests instead of relying on `useNuxtApp()`).
- **VCalendar**: Available as a core Vuetify 3 component (graduated from labs in v3.8) — import via `vuetify/components`, no separate labs import needed.
- **Nuxt 3 error page**: Lives at root `error.vue` (not `layouts/error.vue`). Uses `clearError({ redirect: '/' })` composable to dismiss errors and navigate.
- **Pinia persist**: Enabled globally via `plugins/pinia.js`. Per-store opt-in with `persist: true` in the store definition.
