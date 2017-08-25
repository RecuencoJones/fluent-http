const fluentHttp = require('../../../src')

describe('Validation', () => {
  let source

  beforeEach(() => {
    source = new fluentHttp.Http()
  })

  it('should throw if URL is not a string', () => {
    expect(() => {
      source.withUrl(3)
    }).toThrow(TypeError)
  })

  it('should throw if data is null', () => {
    expect(() => {
      source.withData(null)
    }).toThrow(TypeError)
  })

  it('should throw if no data is passed as query param', () => {
    expect(() => {
      source.withQueryParam()
    }).toThrow(TypeError)
  })

  it('should throw if no data is passed as header', () => {
    expect(() => {
      source.withHeader()
    }).toThrow(TypeError)
  })

  it('should throw if interceptor is not instance of Interceptor', () => {
    expect(() => {
      source.withInterceptor({
        onRequest: s => s,
        onSuccess: r => r,
        onError: r => r
      })
    }).toThrow(TypeError)
  })
})
