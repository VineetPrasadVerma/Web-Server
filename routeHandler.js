const { status, send } = require('./response')

const routeHandler = async (reqObj, routes, middlewares) => {
  reqObj.params = {}
  try {
    for (const middleware of middlewares) {
      const response = await middleware(reqObj, {}, () => {})
      if (response) return response
    }

    const requestUriPath = reqObj.requestUri.split('/').slice(1)
    const methodRoutes = routes[reqObj.method]
    const methodRoutesPath = Object.keys(methodRoutes)

    let routePath

    for (const route of methodRoutesPath) {
      let flag = false
      routePath = route.split('/').slice(1)

      if (requestUriPath.length === routePath.length) {
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

        if (!flag) {
          const respObj = { status, send }
          await routes[reqObj.method][route](reqObj, respObj)
          return respObj.resp
        }
      }
    }

    reqObj.params = {}
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

module.exports = { routeHandler }
