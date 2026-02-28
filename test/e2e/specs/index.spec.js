describe('Home page', () => {
  test('shows welcome heading and continue button', (browser) => {
    const main = browser.page.main()
    main.navigate()
    main.assert.visible('@welcomeHeading')
    main.assert.visible('@continueButton')
    browser.end()
  })
})
