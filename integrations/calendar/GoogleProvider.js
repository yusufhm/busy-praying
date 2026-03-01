import { BaseCalendarProvider } from './BaseCalendarProvider'

/**
 * Google Calendar provider — stub for future implementation.
 *
 * Implementation notes when ready to build:
 *
 * Auth:
 *   Google Identity Services (GIS) with PKCE auth-code flow.
 *   https://developers.google.com/identity/oauth2/web/guides/use-code-model
 *   Scopes: https://www.googleapis.com/auth/calendar.events
 *
 * API base: https://www.googleapis.com/calendar/v3/calendars/primary/events
 *   POST   → createEvent   (returns event.id)
 *   PATCH  → updateEvent
 *   DELETE → deleteEvent
 *
 * Deduplication:
 *   Store the busyPrayingKey in event.extendedProperties.private so events
 *   can be identified on reconnect without relying on the Pinia store.
 *   { extendedProperties: { private: { busyPrayingKey: event.key } } }
 */
export class GoogleProvider extends BaseCalendarProvider {
  get name() {
    return 'google'
  }

  get isConnected() {
    return false
  }

  async connect() {
    throw new Error('Google Calendar integration is not yet implemented')
  }

  async disconnect() {
    throw new Error('Google Calendar integration is not yet implemented')
  }

  async createEvent(_event) {
    throw new Error('Google Calendar integration is not yet implemented')
  }

  async updateEvent(_eventId, _event) {
    throw new Error('Google Calendar integration is not yet implemented')
  }

  async deleteEvent(_eventId) {
    throw new Error('Google Calendar integration is not yet implemented')
  }
}
