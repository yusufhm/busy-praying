export default ({ app }, inject) => {
  const baseApiUrl = 'https://api.aladhan.com/v1'

  const fetchPrayerTimes = async function (params) {
    const url = baseApiUrl + '/calendarByCity'
    const times = await this.$axios.$get(url, { params })
    return times.data
  }
  inject('alAdhanFetchPrayerTimes', fetchPrayerTimes)
}
