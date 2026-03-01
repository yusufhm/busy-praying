# busy-praying

A prayer times SPA built with Nuxt 3, Vuetify 3, and Pinia. Fetches daily prayer times via the [Al Adhan API](https://aladhan.com/prayer-times-api) based on the user's configured city and country.

## Tech Stack

- **[Nuxt 3](https://nuxt.com)** — SSR-disabled, static-target SPA
- **[Vuetify 3](https://vuetifyjs.com)** — UI component library (Material Design)
- **[Pinia](https://pinia.vuejs.org)** with `pinia-plugin-persistedstate` — state management
- **[Al Adhan API](https://aladhan.com/prayer-times-api)** — prayer times data source
- **[country-state-city](https://www.npmjs.com/package/country-state-city)** — country/city selection

## Setup

```bash
npm install
```

## Development

```bash
# Serve with hot reload at localhost:3000
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate
```

## Testing

```bash
# Unit tests (Jest)
npm run test:unit

# E2E tests (Nightwatch + ChromeDriver)
npm run test:e2e
```

## Linting

```bash
# JS + Vue linting (ESLint)
npm run lint:js

# CSS linting (Stylelint)
npm run lint:style

# Run all linters
npm run lint
```
