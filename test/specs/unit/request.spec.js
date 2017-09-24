const fetchMock = require('fetch-mock')
const { Http } = require('../../../src/http')
const { Body } = require('../../../src/body')
const { Interceptor } = require('../../../src/interceptor')

describe('Request', () => {
  let http

  beforeEach(() => {
    global.fetch = fetchMock.sandbox()
    http = new Http()
  })

  afterEach(() => {
    fetch.reset()
    fetch.restore()
  })

  it('should perform a get request', () => {
    fetch.get('/', {
      status: 200
    })

    return http.withUrl('/')
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a get request with query params', () => {
    fetch.get('/?foo=bar', {
      status: 200
    })

    return http.withUrl('/')
      .withQueryParam('foo', 'bar')
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a post request with raw JSON data', () => {
    fetch.post('/api/create', {
      status: 200
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return http.withUrl('/api/create')
      .asPost()
      .withData({
        foo: 'bar'
      })
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(fetch.lastOptions()).toHaveProperty('body', JSON.stringify({
          foo: 'bar'
        }))
      })
  })

  it('should perform a post request with raw plain data', () => {
    // TODO: match body
    fetch.post('/api/create', {
      status: 200
    }, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })

    return http.withUrl('/api/create')
      .asPost()
      .withData('Hello')
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(fetch.lastOptions()).toHaveProperty('body', 'Hello')
      })
  })

  it('should perform a post request with Body JSON data', () => {
    fetch.post('/api/create', {
      status: 200
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return http.withUrl('/api/create')
      .asPost()
      .withData(Body.asJson({
        foo: 'bar'
      }))
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(fetch.lastOptions()).toHaveProperty('body', JSON.stringify({
          foo: 'bar'
        }))
      })
  })

  it('should perform a post request with raw plain data', () => {
    fetch.post('/api/create', {
      status: 200
    }, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })

    return http.withUrl('/api/create')
      .asPost()
      .withData(Body.asPlain('Hello'))
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(fetch.lastOptions()).toHaveProperty('body', 'Hello')
      })
  })

  it('should perform a get request and parse JSON data', () => {
    fetch.get('/', {
      body: JSON.stringify({
        foo: 'bar'
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      status: 200
    })

    return http.withUrl('/')
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.data).toEqual({foo: 'bar'})
      })
  })

  it('should perform a get request with auth interceptor', () => {
    class BasicAuth extends Interceptor {
      onRequest(s) {
        s.headers['Authorization'] = 'Basic foobar'

        return s
      }
    }

    fetch.get('/api/secure', {
      status: 200
    }, {
      headers: {
        Authorization: 'Basic foobar'
      }
    })

    return http.withUrl('/api/secure')
      .withInterceptor(new BasicAuth())
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('should perform a failed request', () => {
    fetch.get('/api/error', {
      status: 400
    })

    return http.withUrl('/api/error')
      .request()
      .catch((response) => {
        expect(response.statusCode).toBe(400)
      })
  })

  it('should perform a failed request with error interceptor', () => {
    class ErrorInterceptor extends Interceptor {
      onError(r) {
        r.responseText = 'Foo'

        return r
      }
    }

    fetch.get('/api/error', {
      status: 400
    })

    return http.withUrl('/api/error')
      .withInterceptor(new ErrorInterceptor())
      .request()
      .catch((response) => {
        expect(response.responseText).toBe('Foo')
      })
  })

  it('should perform a timeout request', () => {
    fetch.get('/api/timeout', {
      status: 408
    })

    return http.withUrl('/api/timeout')
      .request()
      .catch((response) => {
        expect(response.statusCode).toBe(408)
      })
  })

  it('should succeed with 201', () => {
    fetch.post('/api/create', {
      status: 201
    })

    return http.asPost()
      .withUrl('/api/create')
      .request()
      .then((response) => {
        expect(response.statusCode).toBe(201)
      })
  })

  it('should error with 404', () => {
    fetch.get('/api/retrieve', {
      status: 404
    })

    return http.asGet()
      .withUrl('/api/retrieve')
      .request()
      .catch((response) => {
        expect(response.statusCode).toBe(404)
      })
  })
})
