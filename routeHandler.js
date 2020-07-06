const routeHandler = async (reqObj, routes, middlewares) => {
  reqObj.params = {}

  for (const middleware of middlewares) {
    const result = await middleware(reqObj, {}, () => {})
    if (result) return result
  }

  const requestUriPath = reqObj.requestUri.split('/').slice(1)
  const methodRoutes = routes[reqObj.method]
  const methodRoutesPath = Object.keys(methodRoutes)

  let routePath
  for (const route of methodRoutesPath) {
    let flag = false
    routePath = route.split('/').slice(1)

    for (const index in requestUriPath) {
      if (routePath[index] !== undefined && routePath[index].startsWith(':')) {
        reqObj.params[routePath[index].slice(1)] = requestUriPath[index]
      } else {
        if (routePath[index] !== requestUriPath[index]) {
          flag = true
          break
        }
      }
    }

    if (!flag && requestUriPath.length === routePath.length) {
      const respObj = {}

      respObj.status = (code) => {
        let resp =
          `HTTP/1.1 ${code} OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n`
        const date = new Date()
        resp += `Date: ${date.toUTCString()}\r\n`
        resp += 'Content-Type: *\r\n'

        respObj.resp = resp
        return respObj
      }

      respObj.send = (body) => {
        body = JSON.stringify(body)
        console.log('Route Hander', body)
        respObj.resp += `Content-Length: ${body.length}\r\n\r\n`
        respObj.resp += body

        return respObj
      }

      // console.log(routes[reqObj.method][route])
      await routes[reqObj.method][route](reqObj, respObj)

      // console.log(respObj.resp)
      return respObj.resp
    }
  }

  reqObj.params = {}
  return null
}

module.exports = { routeHandler }
