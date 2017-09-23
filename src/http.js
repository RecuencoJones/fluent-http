const { clone, isNil, isString } = require('lodash')
const { Body } = require('./body')
const { Interceptor } = require('./interceptor')
const { doRequest } = require('./request')

class Http {
  constructor() {
    this._method = 'GET'
    this._url = ''
    this._queryParams = {}
    this._headers = {}
    this._data = null
    this._interceptors = []
  }

  asGet() {
    return this._clone((r) => {
      r._method = 'GET'
    })
  }

  asPost() {
    return this._clone((r) => {
      r._method = 'POST'
    })
  }

  asPut() {
    return this._clone((r) => {
      r._method = 'PUT'
    })
  }

  asDelete() {
    return this._clone((r) => {
      r._method = 'DELETE'
    })
  }

  withUrl(url) {
    return this._clone((r) => {
      if (isString(url)) {
        r._url = url
      } else {
        throw new TypeError('URL must be a string')
      }
    })
  }

  withHeader(key, value) {
    return this._clone((r) => {
      if (isString(key) && !isNil(value)) {
        r._headers[key] = value
      } else {
        throw new TypeError('Invalid header')
      }
    })
  }

  withQueryParam(key, value) {
    return this._clone((r) => {
      if (isString(key) && !isNil(value)) {
        r._queryParams[key] = value
      } else {
        throw new TypeError('Invalid query parameter')
      }
    })
  }

  withData(data) {
    return this._clone((r) => {
      if (!isNil(data)) {
        r._data = data
      } else {
        throw new TypeError('Data must not be null')
      }
    })
  }

  withInterceptor(interceptor) {
    return this._clone((r) => {
      if (interceptor instanceof Interceptor) {
        r._interceptors.push(interceptor)
      } else {
        throw new TypeError('Interceptor is not compliant with interface')
      }
    })
  }

  _clone(fn) {
    const _this = clone(this)

    _this._headers = clone(_this._headers)
    _this._queryParams = clone(_this._queryParams)
    _this._interceptors = clone(_this._interceptors)

    fn(_this)

    return _this
  }

  _buildRequest() {
    return {
      method: this._method,
      url: this._url,
      headers: this._headers,
      queryParams: this._queryParams,
      data: Body.parse(this._data)
    }
  }

  request() {
    return doRequest(this._buildRequest(), this._interceptors)
  }
}

module.exports = {
  Http
}
