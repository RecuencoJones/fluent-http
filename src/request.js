const { map, isNil } = require('lodash')

function doRequest(settings, interceptors) {
  let request = settings

  interceptors.forEach((interceptor) => {
    request = interceptor.onRequest(request)
  })

  const query = map(request.queryParams, (value, key) => {
    const _value = encodeURIComponent(value)
    const _key = encodeURIComponent(key)

    return `${_key}=${_value}`
  }).join('&')

  let fetchOptions = {
    mode: 'cors'
  }
  let url = request.url

  if (query) {
    url = `${url}?${query}`
  }

  fetchOptions.method = settings.method
  fetchOptions.headers = settings.headers

  if (!isNil(settings.data)) {
    fetchOptions.headers['Content-Type'] = request.data.mimeType
  }

  if (settings.data) {
    fetchOptions.body = settings.data.body
  }

  return fetch(url, fetchOptions)
    .then((res) => {
      const contentType = res.headers.get('Content-Type')

      let response = {
        statusCode: res.status,
        statusText: res.statusText
      }

      return res.text()
        .then((text) => {
          response.responseText = text

          if (new RegExp('application/json').test(contentType)) {
            response.data = JSON.parse(response.responseText)
          }

          if (res.ok) {
            interceptors.forEach((interceptor) => {
              response = interceptor.onSuccess(response)
            })

            return response
          } else {
            interceptors.forEach((interceptor) => {
              response = interceptor.onError(response)
            })

            throw response
          }
        })
    })
}

module.exports = {
  doRequest
}
