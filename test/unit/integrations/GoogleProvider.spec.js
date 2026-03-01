import { GoogleProvider } from '@/integrations/calendar/GoogleProvider'

describe('GoogleProvider', () => {
  let provider

  beforeEach(() => {
    provider = new GoogleProvider()
  })

  it('name returns "google"', () => {
    expect(provider.name).toBe('google')
  })

  it('isConnected always returns false (stub)', () => {
    expect(provider.isConnected).toBe(false)
  })

  it('connect() rejects with "not yet implemented"', async () => {
    await expect(provider.connect()).rejects.toThrow(
      'Google Calendar integration is not yet implemented',
    )
  })

  it('disconnect() rejects with "not yet implemented"', async () => {
    await expect(provider.disconnect()).rejects.toThrow(
      'Google Calendar integration is not yet implemented',
    )
  })

  it('createEvent() rejects with "not yet implemented"', async () => {
    await expect(provider.createEvent({})).rejects.toThrow(
      'Google Calendar integration is not yet implemented',
    )
  })

  it('updateEvent() rejects with "not yet implemented"', async () => {
    await expect(provider.updateEvent('id', {})).rejects.toThrow(
      'Google Calendar integration is not yet implemented',
    )
  })

  it('deleteEvent() rejects with "not yet implemented"', async () => {
    await expect(provider.deleteEvent('id')).rejects.toThrow(
      'Google Calendar integration is not yet implemented',
    )
  })
})
