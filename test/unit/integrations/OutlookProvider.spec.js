import { OutlookProvider } from '@/integrations/calendar/OutlookProvider'

// $fetch is a Nuxt global — stub it for the test environment
global.$fetch = jest.fn()

// Factory that returns a fresh mock MSAL PublicClientApplication
function makeMsalMock({ loginAccount = { homeAccountId: 'acc-123' } } = {}) {
  return {
    initialize: jest.fn().mockResolvedValue(undefined),
    loginPopup: jest.fn().mockResolvedValue({ account: loginAccount }),
    logoutPopup: jest.fn().mockResolvedValue(undefined),
    acquireTokenSilent: jest
      .fn()
      .mockResolvedValue({ accessToken: 'mock-token' }),
  }
}

describe('OutlookProvider', () => {
  let msal
  let provider

  beforeEach(() => {
    msal = makeMsalMock()
    provider = new OutlookProvider(msal)
    jest.clearAllMocks()
    // Reset the $fetch mock for each test
    global.$fetch.mockReset()
  })

  describe('initial state', () => {
    it('name returns "outlook"', () => {
      expect(provider.name).toBe('outlook')
    })

    it('isConnected returns false before connect()', () => {
      expect(provider.isConnected).toBe(false)
    })
  })

  describe('connect()', () => {
    it('initialises MSAL and calls loginPopup', async () => {
      await provider.connect()
      expect(msal.initialize).toHaveBeenCalled()
      expect(msal.loginPopup).toHaveBeenCalledWith({
        scopes: ['Calendars.ReadWrite'],
      })
    })

    it('returns the account homeAccountId', async () => {
      const accountId = await provider.connect()
      expect(accountId).toBe('acc-123')
    })

    it('sets isConnected to true after a successful login', async () => {
      await provider.connect()
      expect(provider.isConnected).toBe(true)
    })
  })

  describe('disconnect()', () => {
    it('calls logoutPopup and sets isConnected to false', async () => {
      await provider.connect()
      await provider.disconnect()
      expect(msal.logoutPopup).toHaveBeenCalled()
      expect(provider.isConnected).toBe(false)
    })

    it('does not call logoutPopup when already disconnected', async () => {
      await provider.disconnect()
      expect(msal.logoutPopup).not.toHaveBeenCalled()
    })
  })

  describe('createEvent()', () => {
    const event = {
      title: 'Fajr',
      start: new Date('2026-03-01T05:30:00Z'),
      end: new Date('2026-03-01T05:45:00Z'),
      key: 'GB-London-2026-3-Fajr-01 Mar 2026',
    }

    beforeEach(async () => {
      await provider.connect()
      global.$fetch.mockResolvedValue({ id: 'graph-evt-001' })
    })

    it('acquires a token silently and POSTs to the Graph API', async () => {
      await provider.createEvent(event)
      expect(msal.acquireTokenSilent).toHaveBeenCalled()
      expect(global.$fetch).toHaveBeenCalledWith(
        'https://graph.microsoft.com/v1.0/me/events',
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer mock-token' },
        }),
      )
    })

    it('returns the event ID from the Graph API response', async () => {
      const id = await provider.createEvent(event)
      expect(id).toBe('graph-evt-001')
    })

    it('sends the correct event body shape', async () => {
      await provider.createEvent(event)
      const body = global.$fetch.mock.calls[0][1].body
      expect(body.subject).toBe('Fajr')
      expect(body.start.dateTime).toBe(event.start.toISOString())
      expect(body.end.dateTime).toBe(event.end.toISOString())
      expect(body.start.timeZone).toBe('UTC')
      // Extended property tags the event for dedup on reconnect
      expect(body.singleValueExtendedProperties).toHaveLength(1)
      expect(body.singleValueExtendedProperties[0].value).toBe(event.key)
    })
  })

  describe('updateEvent()', () => {
    beforeEach(async () => {
      await provider.connect()
      global.$fetch.mockResolvedValue(undefined)
    })

    it('PATCHes the correct Graph API endpoint', async () => {
      const event = {
        title: 'Fajr',
        start: new Date('2026-03-01T05:30:00Z'),
        end: new Date('2026-03-01T05:45:00Z'),
        key: 'some-key',
      }
      await provider.updateEvent('graph-evt-001', event)
      expect(global.$fetch).toHaveBeenCalledWith(
        'https://graph.microsoft.com/v1.0/me/events/graph-evt-001',
        expect.objectContaining({ method: 'PATCH' }),
      )
    })
  })

  describe('deleteEvent()', () => {
    beforeEach(async () => {
      await provider.connect()
      global.$fetch.mockResolvedValue(undefined)
    })

    it('sends a DELETE request for the correct event ID', async () => {
      await provider.deleteEvent('graph-evt-001')
      expect(global.$fetch).toHaveBeenCalledWith(
        'https://graph.microsoft.com/v1.0/me/events/graph-evt-001',
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })
})
