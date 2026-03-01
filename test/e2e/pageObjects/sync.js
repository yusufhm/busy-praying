module.exports = {
  commands: [],
  url: 'http://localhost:3000/sync',
  elements: {
    heading: {
      selector: 'h1',
    },
    outlookCard: {
      // Vuetify v-card containing the Outlook provider
      selector: '.v-card:has(.mdi-microsoft-outlook)',
    },
    googleCard: {
      selector: '.v-card:has(.mdi-google)',
    },
    outlookConnectBtn: {
      selector: '.v-card:has(.mdi-microsoft-outlook) .v-btn:not([disabled])',
    },
    googleComingSoonChip: {
      selector: '.v-card:has(.mdi-google) .v-chip',
    },
  },
}
