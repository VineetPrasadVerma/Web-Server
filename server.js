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

  socket.on('data', async (data) => {
    // Request
    const requestObject = requestParser(data)

    // Response
    let res = await routeHandler(requestObject, routes, middlewares)
    if (!res) {
      res = await errorResponse()
    }

    socket.write(res)
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
