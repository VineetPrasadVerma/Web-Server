const net = require('net')

const server = net.createServer()

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress} : ${socket.remotePort}`
  console.log('New client connected on ', remoteAddress)

  socket.on('data', (data) => {
    console.log(data.toString())
    socket.write(`Server Reply : ${data}`)
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
