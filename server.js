const net = require('net')

const server = net.createServer()

server.on('connection', (socket) => {
  const address = `${socket.remoteAddress} : ${socket.remotePort}`
  console.log('Connection Estabilished on ', address)

  socket.on('data', (data) => {
    console.log(data + ' recieved from client')
    socket.write(`Server Reply : ${data}`)
  })

  socket.on('end', () => {
    console.log('Connection closed')
  })
})

server.listen(8000, () => {
  console.log('server is listening on port 8000')
})
