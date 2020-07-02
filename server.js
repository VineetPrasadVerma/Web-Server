const net = require('net')
const { requestParser } = require('./requestParser')
const { serveStaticFile } = require('./staticHandler')
const { routeHandler } = require('./routeHandler')
const { errorResponse } = require('./errorResponse')

const server = net.createServer()

const routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {}
}

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress} : ${socket.remotePort}`
  console.log('New client connected on ', remoteAddress)

  socket.on('data', async (data) => {
    // Request
    const requestObject = requestParser(data)
    console.log(requestObject)

    // Response
    let res = await serveStaticFile(requestObject)
    if (!res) {
      res = await routeHandler(requestObject, routes)
      if (!res) {
        res = await errorResponse()
      }
    }

    console.log(res)
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
  listen: (port) => {
    server.listen(port, () => {
      console.log('server is listening on port 8000')
    })
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
