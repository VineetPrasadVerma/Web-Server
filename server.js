const net = require('net')
const { requestParser } = require('./requestParser')
const { serveStaticFile } = require('./staticHandler')
const { routeHandler } = require('./routeHandler')
const { errorResponse } = require('./errorResponse')

const server = net.createServer()

const routes = {
  GET: {
    '/tasks': (req, res) => {
      console.log(req.params)
    },
    '/tasks/:id/subtasks/:id2': (req, res) => {
      console.log(req.params)
    }
  },
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
        res = errorResponse()
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

server.listen(8000, () => {
  console.log('server is listening on port 8000')
})
