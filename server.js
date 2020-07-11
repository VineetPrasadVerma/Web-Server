const net = require('net')
const { requestParser } = require('./requestParser')
const { routeHandler } = require('./routeHandler')
const { errorResponse } = require('./response')

const server = net.createServer()

const routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {}
}

const middlewares = []
server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress} : ${socket.remotePort}`
  console.log('New client connected on ', remoteAddress)

  let requestString
  let flag = false
  let body
  let requestObject

  socket.on('data', async (data) => {
    if (!flag) {
      requestString = data.toString()
      const requestLineAndHeaders = requestString.split(/\r\n\r\n/)[0]
      requestObject = requestParser(requestLineAndHeaders)
      body = data.slice(data.indexOf('\r\n\r\n') + 4)
      data = Buffer.from('')
      flag = true
    }

    // Response
    if (!requestObject.headers['Content-Length']) {
      let res = await routeHandler(requestObject, routes, middlewares)
      if (!res) {
        res = await errorResponse()
      }
      return socket.end(res)
    }

    body = Buffer.concat([body, data])
    if (Number(requestObject.headers['Content-Length']) === body.byteLength) {
      // Response
      requestObject.body = body.toString()
      let res = await routeHandler(requestObject, routes, middlewares)
      console.log(requestObject)
      if (!res) {
        res = await errorResponse()
      }
      return socket.end(res)
    }
  })

  socket.once('close', () => {
    console.log(`Connection from ${remoteAddress} closed`)
  })

  socket.on('error', (err) => {
    console.log(`Some error occurred: ${err.message}`)
  })
})

const app = {
  listen: (port, fun) => {
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })

    fun()
  },

  use: (middleware) => {
    middlewares.push(middleware)
  },

  get: (path, handler) => {
    Object.assign(routes.GET, { [path]: handler })
  },

  post: (path, handler) => {
    Object.assign(routes.POST, { [path]: handler })
  },

  put: (path, handler) => {
    Object.assign(routes.PUT, { [path]: handler })
  },

  delete: (path, handler) => {
    Object.assign(routes.DELETE, { [path]: handler })
  }
}

module.exports = { app }
