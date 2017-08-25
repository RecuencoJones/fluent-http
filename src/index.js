const _ = require('lodash')

class BodyType {
  constructor(mimeType, body) {
    this._mimeType = mimeType
    this._body = body
  }

  get mimeType() {
    return this._mimeType
  }

  get body() {
    return this._body
  }
}

class Body {
  static asJson(data) {
    return new BodyType('application/json', JSON.stringify(data))
  }

  static asPlain(data) {
    return new BodyType('text/plain', data)
  }
}

class Interceptor {
  onRequest(settings) {
    return settings
  }

  onSuccess(response) {
    return response
  }

  onError(response) {
    return response
  }
}

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
      if (_.isString(url)) {
        r._url = url
      } else {
        throw new TypeError('URL must be a string')
      }
    })
  }

  withHeader(key, value) {
    return this._clone((r) => {
      if (_.isString(key) && !_.isNil(value)) {
        r._headers[key] = value
      } else {
        throw new TypeError('Invalid header')
      }
    })
  }

  withQueryParam(key, value) {
    return this._clone((r) => {
      if (_.isString(key) && !_.isNil(value)) {
        r._queryParams[key] = value
      } else {
        throw new TypeError('Invalid query parameter')
      }
    })
  }

  withData(data) {
    return this._clone((r) => {
      if (!_.isNil(data)) {
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
    const _this = _.clone(this)

    _this._headers = _.clone(_this._headers)
    _this._queryParams = _.clone(_this._queryParams)
    _this._interceptors = _.clone(_this._interceptors)

    fn(_this)

    return _this
  }

  _processBody(data) {
    if (data instanceof BodyType) {
      return data
    } else if (typeof data === 'object' && !_.isNil(data)) {
      return Body.asJson(data)
    } else if (typeof data === 'string') {
      return Body.asPlain(data)
    } else {
      return null
    }
  }

  _buildRequest() {
    return {
      method: this._method,
      url: this._url,
      headers: this._headers,
      queryParams: this._queryParams,
      data: this._processBody(this._data)
    }
  }

  request() {
    let request = this._buildRequest()

    this._interceptors.forEach((interceptor) => {
      request = interceptor.onRequest(request)
    })

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const query = _.map(request.queryParams, (value, key) => {
        const _value = encodeURIComponent(value)
        const _key = encodeURIComponent(key)

        return `${_key}=${_value}`
      }).join('&')
      let response = {}
      let url = request.url

      if (query) {
        url = `${url}?${query}`
      }

      xhr.open(request.method, url)

      _.map(request.headers, (value, key) => {
        xhr.setRequestHeader(key, value)
      })

      if (!_.isNil(request.data)) {
        xhr.setRequestHeader('Content-Type', request.data.mimeType)
      }

      xhr.onload = () => {
        response.statusCode = xhr.status
        response.statusText = xhr.statusText
        response.responseText = xhr.responseText

        if (response.statusCode >= 200 && response.statusCode < 400) {
          this._interceptors.forEach((interceptor) => {
            response = interceptor.onSuccess(response)
          })

          resolve(response)
        } else {
          this._interceptors.forEach((interceptor) => {
            response = interceptor.onError(response)
          })

          reject(response)
        }
      }

      xhr.ontimeout = () => {
        response.statusCode = 408
        response.statusText = 'Request Timeout'
        response.responseText = null

        reject(response)
      }

      _.isNil(request.data) ? xhr.send() : xhr.send(request.data.body)
    })
  }
}

module.exports = {
  Http,
  Interceptor,
  Body,
  BodyType
}
