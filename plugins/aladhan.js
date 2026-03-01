export default defineNuxtPlugin((nuxtApp) => {
  const baseApiUrl = 'https://api.aladhan.com/v1'

  const fetchPrayerTimes = (params) => {
    return $fetch(`${baseApiUrl}/calendarByCity`, { params }).then(
      (res) => res.data
    )
  }

  nuxtApp.provide('alAdhanFetchPrayerTimes', fetchPrayerTimes)
})
