/**
 * Abstract base class for calendar provider integrations.
 *
 * Both OutlookProvider and GoogleProvider implement this interface, so the
 * sync composable can work with any provider without knowing its internals.
 *
 * @typedef {Object} CalendarEvent
 * @property {string} title  - Prayer name, e.g. "Fajr"
 * @property {Date}   start  - Event start time
 * @property {Date}   end    - Event end time (start + 15 min)
 * @property {string} key    - Internal dedup key used to tag the event
 */
export class BaseCalendarProvider {
  /** Stable identifier for this provider (e.g. 'outlook', 'google') */
  get name() {
    throw new Error(`${this.constructor.name} must implement get name()`)
  }

  /** Whether the user has an active OAuth session */
  get isConnected() {
    throw new Error(`${this.constructor.name} must implement get isConnected()`)
  }

  /**
   * Trigger the OAuth flow and store the resulting account/token.
   * @returns {Promise<string>} The provider account ID to persist in the store
   */
  async connect() {
    throw new Error(`${this.constructor.name} must implement connect()`)
  }

  /**
   * Revoke the OAuth session and clear cached tokens.
   * @returns {Promise<void>}
   */
  async disconnect() {
    throw new Error(`${this.constructor.name} must implement disconnect()`)
  }

  /**
   * Create a new event in the user's calendar.
   * @param {CalendarEvent} event
   * @returns {Promise<string>} The provider's event ID (for future updates)
   */
  async createEvent(event) {
    throw new Error(`${this.constructor.name} must implement createEvent()`)
  }

  /**
   * Update an existing event by its provider-assigned ID.
   * @param {string} eventId
   * @param {CalendarEvent} event
   * @returns {Promise<void>}
   */
  async updateEvent(eventId, event) {
    throw new Error(`${this.constructor.name} must implement updateEvent()`)
  }

  /**
   * Delete an event by its provider-assigned ID.
   * @param {string} eventId
   * @returns {Promise<void>}
   */
  async deleteEvent(eventId) {
    throw new Error(`${this.constructor.name} must implement deleteEvent()`)
  }
}
