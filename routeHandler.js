const routeHandler = (reqObj, routes) => {
  reqObj.params = {}

  const requestUriPath = reqObj.requestUri.split('/').slice(1)
  const methodRoutes = routes[reqObj.method]
  const methodRoutesPath = Object.keys(methodRoutes)

  let routePath
  for (const route of methodRoutesPath) {
    let flag = false
    routePath = route.split('/').slice(1)

    for (const index in requestUriPath) {
      if ((routePath[index] !== undefined) && routePath[index].startsWith(':')) {
        reqObj.params[routePath[index].slice(1)] = requestUriPath[index]
      } else {
        if (routePath[index] !== requestUriPath[index]) {
          flag = true
          break
        }
      }
    }

    if (!flag && (requestUriPath.length === routePath.length)) {
      let res =
      'HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
      const date = new Date()
      res += `Date: ${date.toUTCString()}\r\n`
      res += 'Content-Type: *\r\n'
      const body = 'Vineet'
      res += `Content-Length: ${2 + 3}\r\n\r\n`
      res += body

      return res
    }
  }

  reqObj.params = {}
  return null
}

module.exports = { routeHandler }
