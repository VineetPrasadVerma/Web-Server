const net = require('net')

const server = net.createServer()

const requestObject = {}
server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress} : ${socket.remotePort}`
  console.log('New client connected on ', remoteAddress)

  socket.on('data', (data) => {
    const request = data.toString().split(/\r\n/)
    console.log(request)
    const requestLine = request[0]

    const [method, requestUri, version] = requestLine.split(' ')
    requestObject.method = method
    requestObject.requestUri = requestUri
    requestObject.version = version

    const headers = {}
    for(let i=1; i<request.length-2; i++){
      const [headerType, headerValue] = request[i].split(':')
      headers[headerType] = headerValue
    }

    requestObject.headers = headers

    requestObject.body = request[request.length - 1]

    console.log(requestObject)
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
