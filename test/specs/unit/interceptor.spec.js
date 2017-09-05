const { Interceptor } = require('../../../src/interceptor')

describe('Interceptor default interface', () => {
  let interceptor

  beforeEach(() => {
    interceptor = new Interceptor()
  })

  it('should return same settings onRequest', () => {
    let settings = {}

    expect(interceptor.onRequest(settings)).toBe(settings)
  })

  it('should return same response onSuccess', () => {
    let response = {}

    expect(interceptor.onSuccess(response)).toBe(response)
  })

  it('should return same response onError', () => {
    let response = {}

    expect(interceptor.onError(response)).toBe(response)
  })
})
