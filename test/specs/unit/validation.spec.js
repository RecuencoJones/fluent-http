const { Http } = require('../../../src/http')

describe('Validation', () => {
  let source

  beforeEach(() => {
    source = new Http()
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

  it('should throw if no data is passed as query param 1', () => {
    expect(() => {
      source.withQueryParam()
    }).toThrow(TypeError)
  })

  it('should throw if no data is passed as query param 2', () => {
    expect(() => {
      source.withQueryParam(3, 'value')
    }).toThrow(TypeError)
  })

  it('should throw if no data is passed as query param 3', () => {
    expect(() => {
      source.withQueryParam('key')
    }).toThrow(TypeError)
  })

  it('should throw if no data is passed as header 1', () => {
    expect(() => {
      source.withHeader()
    }).toThrow(TypeError)
  })

  it('should throw if no data is passed as header 2', () => {
    expect(() => {
      source.withHeader(3, 'value')
    }).toThrow(TypeError)
  })

  it('should throw if no data is passed as header 3', () => {
    expect(() => {
      source.withHeader('key')
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
