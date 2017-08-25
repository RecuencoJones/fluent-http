const mockXhr = require('xhr-mock')
const fluentHttp = require('../../../src')

describe('Request', () => {
  let http

  beforeEach(() => {
    http = new fluentHttp.Http()
    mockXhr.setup().reset()
  })

  afterEach(() => {
    mockXhr.teardown()
  })

  it('should perform a get request', () => {
    mockXhr.get('', (__, res) => res.status(200))

    return http.request().then((response) => {
      expect(response.statusCode).toBe(200)
    })
  })

  it('should perform a get request with query params', () => {
    mockXhr.get(/.*/, (req, res) => {
      expect(req.query()).toEqual({foo: 'bar'})

      return res.status(200)
    })

    return http.withUrl('/')
      .withQueryParam('foo', 'bar')
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a post request with raw JSON data', () => {
    mockXhr.post('/api/create', (req, res) => {
      expect(req.header('Content-Type')).toBe('application/json')
      expect(JSON.parse(req.body())).toEqual({foo: 'bar'})

      return res.status(200)
    })

    return http.withUrl('/api/create')
      .asPost()
      .withData({
        foo: 'bar'
      })
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a post request with raw plain data', () => {
    mockXhr.post('/api/create', (req, res) => {
      expect(req.header('Content-Type')).toBe('text/plain')
      expect(req.body()).toEqual('Hello')

      return res.status(200)
    })

    return http.withUrl('/api/create')
      .asPost()
      .withData('Hello')
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a post request with Body JSON data', () => {
    mockXhr.post('/api/create', (req, res) => {
      expect(req.header('Content-Type')).toBe('application/json')
      expect(JSON.parse(req.body())).toEqual({foo: 'bar'})

      return res.status(200)
    })

    return http.withUrl('/api/create')
      .asPost()
      .withData(fluentHttp.Body.asJson({
        foo: 'bar'
      }))
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a post request with raw plain data', () => {
    mockXhr.post('/api/create', (req, res) => {
      expect(req.header('Content-Type')).toBe('text/plain')
      expect(req.body()).toEqual('Hello')

      return res.status(200)
    })

    return http.withUrl('/api/create')
      .asPost()
      .withData(fluentHttp.Body.asPlain('Hello'))
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a get request with auth interceptor', () => {
    class BasicAuth extends fluentHttp.Interceptor {
      onRequest(s) {
        s.headers['Authorization'] = 'Basic foobar'

        return s
      }
    }

    mockXhr.get('/api/secure', (req, res) => {
      expect(req.header('Authorization')).toBe('Basic foobar')

      return res.status(200)
    })

    return http.withUrl('/api/secure')
      .withInterceptor(new BasicAuth())
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a failed request', () => {
    mockXhr.get('/api/error', (req, res) => {
      return res.status(400)
    })

    return http.withUrl('/api/error')
      .request()
      .catch((response) => {
        expect(response.statusCode).toBe(400)
      })
  })

  it('should perform a failed request with error interceptor', () => {
    class ErrorInterceptor extends fluentHttp.Interceptor {
      onError(r) {
        r.responseText = 'Foo'

        return r
      }
    }

    mockXhr.get('/api/error', (req, res) => {
      return res.status(400)
    })

    return http.withUrl('/api/error')
      .withInterceptor(new ErrorInterceptor())
      .request()
      .catch((response) => {
        expect(response.responseText).toBe('Foo')
      })
  })

  it('should perform a timeout request', () => {
    mockXhr.get('/api/timeout', (req, res) => {
      return res.timeout(true)
    })

    return http.withUrl('/api/timeout')
      .request()
      .catch((response) => {
        expect(response.statusCode).toBe(408)
      })
  })
})
