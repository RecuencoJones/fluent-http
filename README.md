[![npm version](https://badge.fury.io/js/fluent-http.svg)](https://www.npmjs.com/package/fluent-http)
[![Build Status](https://api.travis-ci.org/RecuencoJones/fluent-http.svg?branch=develop)](https://travis-ci.org/RecuencoJones/fluent-http)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![ncloc](https://sonarcloud.io/api/badges/measure?key=RecuencoJones.fluent-http%3Adevelop&metric=ncloc)](https://sonarcloud.io/dashboard?id=RecuencoJones.fluent-http%3Adevelop)
[![coverage](https://sonarcloud.io/api/badges/measure?key=RecuencoJones.fluent-http%3Adevelop&metric=coverage)](https://sonarcloud.io/dashboard?id=RecuencoJones.fluent-http%3Adevelop)
[![sqale_debt_ratio](https://sonarcloud.io/api/badges/measure?key=RecuencoJones.fluent-http%3Adevelop&metric=sqale_debt_ratio)](https://sonarcloud.io/dashboard?id=RecuencoJones.fluent-http%3Adevelop)

# fluent-http

## Usage

```
npm install fluent-http
```

### Script tag
```
// HTML
<script src="node_modules/fluent-http/dist/fluent-http.js"></script>

// JS
window.fluentHttp
```

### CommonJS

```
const fluentHttp = require('fluent-http')
```

### ES6 import

```
import { Http } from 'fluent-http'
```

## Examples

```
const client = new fluentHttp.Http()

client.withUrl('https://google.com')
.request()
.then((response) => {
  console.log(response)
})
```

```
class BasicAuthInterceptor extends fluentHttp.Interceptor { ... }

const client = new fluentHttp.Http()

client.asPost()
.withUrl('/api/create')
.withInterceptor(new BasicAuthInterceptor(user, pass))
.withData(fluentHttp.Body.asJson(someData))
.request()
.then((response) => {
  console.log(response)
})
```

## Development

### Tests

- Mock package: [xhr-mock](https://www.npmjs.com/package/xhr-mock)

## Links of interest

- [aurelia/http-client](https://github.com/aurelia/http-client)
- [bakerface/fluent-request](https://github.com/bakerface/fluent-request)
