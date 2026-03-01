// Minimal stub for useNuxtApp() used inside Pinia store actions
let _app = {}

module.exports = {
  useNuxtApp: () => _app,
  defineNuxtPlugin: (fn) => fn,
  __setApp: (app) => {
    _app = app
  },
}
