const { isNil } = require('lodash')

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

  static parse(data) {
    if (data instanceof BodyType) {
      return data
    } else if (typeof data === 'object' && !isNil(data)) {
      return Body.asJson(data)
    } else if (typeof data === 'string') {
      return Body.asPlain(data)
    } else {
      return null
    }
  }
}

module.exports = {
  Body,
  BodyType
}
