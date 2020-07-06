const fs = require('fs').promises
const path = require('path')

const contentType = {
  '.js': 'application/js',
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png'
}

const serveStaticFile = async (requestObj, respObj) => {
  let res = null
  try {
    if (requestObj.method === 'GET') {
      if (requestObj.requestUri === '/') requestObj.requestUri = '/index.html'
      res =
      'HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
      const date = new Date()
      res += `Date: ${date.toUTCString()}\r\n`
      res += `Content-Type: ${contentType[path.extname(requestObj.requestUri)]}\r\n`
      const body = await fs.readFile(`./public/${requestObj.requestUri}`)
      res += `Content-Length: ${body.length}\r\n\r\n`
      res += body

      return res
    }
    return null
  } catch (err) {
    console.log('Catch here', err)
    return null
  }
}

module.exports = { serveStaticFile }
