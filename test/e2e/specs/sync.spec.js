describe('Sync page', () => {
  test('shows the page heading', (browser) => {
    const page = browser.page.sync()
    page.navigate()
    page.assert.visible('@heading')
    page.assert.containsText('@heading', 'Calendar Sync')
    browser.end()
  })

  test('shows the Outlook provider card with a Connect button', (browser) => {
    const page = browser.page.sync()
    page.navigate()
    page.assert.visible('@outlookCard')
    page.assert.visible('@outlookConnectBtn')
    browser.end()
  })

  test('shows the Google provider card with a "Coming soon" chip', (browser) => {
    const page = browser.page.sync()
    page.navigate()
    page.assert.visible('@googleCard')
    page.assert.visible('@googleComingSoonChip')
    page.assert.containsText('@googleComingSoonChip', 'Coming soon')
    browser.end()
  })

  test('does not show the sync panel when no provider is connected', (browser) => {
    const page = browser.page.sync()
    page.navigate()
    // The "Sync prayer times" card is only rendered when anyConnected is true
    browser.assert.not.elementPresent(
      '.v-card-title*=Sync prayer times',
    )
    browser.end()
  })
})
