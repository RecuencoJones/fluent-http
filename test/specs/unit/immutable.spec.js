const { Http } = require('../../../src/http')
const { Interceptor } = require('../../../src/interceptor')

describe('Immutable', () => {
  let source

  beforeEach(() => {
    source = new Http()
  })

  it('should create a new instance 1', () => {
    const dest = source.asPost().asGet()

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_method', 'GET')
    expect(dest).toHaveProperty('_method', 'GET')
  })

  it('should create a new instance 2', () => {
    const dest = source.asPost()

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_method', 'GET')
    expect(dest).toHaveProperty('_method', 'POST')
  })

  it('should create a new instance 3', () => {
    const dest = source.asPut()

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_method', 'GET')
    expect(dest).toHaveProperty('_method', 'PUT')
  })

  it('should create a new instance 4', () => {
    const dest = source.asDelete()

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_method', 'GET')
    expect(dest).toHaveProperty('_method', 'DELETE')
  })

  it('should create a new instance 5', () => {
    const dest = source.withUrl('/')

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_url', '')
    expect(dest).toHaveProperty('_url', '/')
  })

  it('should create a new instance 6', () => {
    const dest = source.withQueryParam('foo', 'bar')

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_queryParams', {})
    expect(dest).toHaveProperty('_queryParams', {foo: 'bar'})
  })

  it('should create a new instance 7', () => {
    source = source.withQueryParam('foo', 'bar')

    const dest = source.withQueryParam('foo', 'baz')

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_queryParams', {foo: 'bar'})
    expect(dest).toHaveProperty('_queryParams', {foo: 'baz'})
  })

  it('should create a new instance 8', () => {
    const dest = source.withHeader('foo', 'bar')

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_headers', {})
    expect(dest).toHaveProperty('_headers', {foo: 'bar'})
  })

  it('should create a new instance 9', () => {
    class SomeInterceptor extends Interceptor {}

    const interceptor = new SomeInterceptor()
    const dest = source.withInterceptor(interceptor)

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_interceptors', [])
    expect(dest).toHaveProperty('_interceptors', [interceptor])
  })

  it('should create a new instance 10', () => {
    class SomeInterceptor extends Interceptor {}

    const interceptor1 = new SomeInterceptor()
    const interceptor2 = new SomeInterceptor()

    source = source.withInterceptor(interceptor1)

    const dest = source.withInterceptor(interceptor2)

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_interceptors', [interceptor1])
    expect(dest).toHaveProperty('_interceptors', [interceptor1, interceptor2])
  })

  it('should create a new instance 11', () => {
    const dest = source.withData({})

    expect(source).not.toBe(dest)
    expect(source).toHaveProperty('_data', null)
    expect(dest).toHaveProperty('_data', {})
  })

  it('should create a new instance n', () => {
    const dest = source._clone(() => {})

    expect(source).not.toBe(dest)
    expect(source._headers).not.toBe(dest._headers)
    expect(source._queryParams).not.toBe(dest._queryParams)
    expect(source._interceptors).not.toBe(dest._interceptors)
  })
})
