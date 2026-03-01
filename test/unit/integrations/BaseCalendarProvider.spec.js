import { BaseCalendarProvider } from '@/integrations/calendar/BaseCalendarProvider'

describe('BaseCalendarProvider', () => {
  let provider

  beforeEach(() => {
    provider = new BaseCalendarProvider()
  })

  it('get name() throws a "must implement" error', () => {
    expect(() => provider.name).toThrow(
      'BaseCalendarProvider must implement get name()',
    )
  })

  it('get isConnected() throws a "must implement" error', () => {
    expect(() => provider.isConnected).toThrow(
      'BaseCalendarProvider must implement get isConnected()',
    )
  })

  it('connect() rejects with a "must implement" error', async () => {
    await expect(provider.connect()).rejects.toThrow(
      'BaseCalendarProvider must implement connect()',
    )
  })

  it('disconnect() rejects with a "must implement" error', async () => {
    await expect(provider.disconnect()).rejects.toThrow(
      'BaseCalendarProvider must implement disconnect()',
    )
  })

  it('createEvent() rejects with a "must implement" error', async () => {
    await expect(provider.createEvent({})).rejects.toThrow(
      'BaseCalendarProvider must implement createEvent()',
    )
  })

  it('updateEvent() rejects with a "must implement" error', async () => {
    await expect(provider.updateEvent('id', {})).rejects.toThrow(
      'BaseCalendarProvider must implement updateEvent()',
    )
  })

  it('deleteEvent() rejects with a "must implement" error', async () => {
    await expect(provider.deleteEvent('id')).rejects.toThrow(
      'BaseCalendarProvider must implement deleteEvent()',
    )
  })

  it('subclass overrides are not blocked', () => {
    class ConcreteProvider extends BaseCalendarProvider {
      get name() { return 'concrete' }
      get isConnected() { return false }
    }
    const concrete = new ConcreteProvider()
    expect(concrete.name).toBe('concrete')
    expect(concrete.isConnected).toBe(false)
  })
})
