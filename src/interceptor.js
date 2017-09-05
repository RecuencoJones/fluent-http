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

module.exports = {
  Interceptor
}
