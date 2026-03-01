import { BaseCalendarProvider } from './BaseCalendarProvider'

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0'
const SCOPES = ['Calendars.ReadWrite']

// Custom single-value extended property used to tag events created by Busy
// Praying so they can be identified on reconnect and updated rather than
// duplicated. The GUID is arbitrary but must be stable across app versions.
const BUSY_PRAYING_PROP_ID =
  'String {d5e5e5e5-0000-0000-0000-000000000001} Name busyPrayingKey'

/**
 * Converts a normalised CalendarEvent to a Microsoft Graph event body.
 * @param {import('./BaseCalendarProvider').CalendarEvent} event
 */
function toGraphBody(event) {
  return {
    subject: event.title,
    start: {
      dateTime: event.start.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: event.end.toISOString(),
      timeZone: 'UTC',
    },
    singleValueExtendedProperties: [
      { id: BUSY_PRAYING_PROP_ID, value: event.key ?? '' },
    ],
  }
}

export class OutlookProvider extends BaseCalendarProvider {
  /**
   * @param {import('@azure/msal-browser').PublicClientApplication} msalInstance
   */
  constructor(msalInstance) {
    super()
    this._msal = msalInstance
    this._account = null
  }

  get name() {
    return 'outlook'
  }

  get isConnected() {
    return !!this._account
  }

  async connect() {
    await this._msal.initialize()
    const result = await this._msal.loginPopup({ scopes: SCOPES })
    this._account = result.account
    return result.account.homeAccountId
  }

  async disconnect() {
    if (this._account) {
      await this._msal.logoutPopup({ account: this._account })
    }
    this._account = null
  }

  async _getToken() {
    const result = await this._msal.acquireTokenSilent({
      scopes: SCOPES,
      account: this._account,
    })
    return result.accessToken
  }

  async createEvent(event) {
    const token = await this._getToken()
    const data = await $fetch(`${GRAPH_BASE}/me/events`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: toGraphBody(event),
    })
    return data.id
  }

  async updateEvent(eventId, event) {
    const token = await this._getToken()
    await $fetch(`${GRAPH_BASE}/me/events/${eventId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: toGraphBody(event),
    })
  }

  async deleteEvent(eventId) {
    const token = await this._getToken()
    await $fetch(`${GRAPH_BASE}/me/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}
