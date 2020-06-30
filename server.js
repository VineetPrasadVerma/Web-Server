const net = require('net')
const { requestParser } = require('./requestParser')
const { createResponse } = require('./serveStaticFile')

const server = net.createServer()

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress} : ${socket.remotePort}`
  console.log('New client connected on ', remoteAddress)

  socket.on('data', async (data) => {
    // Request
    const requestObject = requestParser(data)
    console.log(requestObject)

    // Response
    const res = await createResponse(requestObject)
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
