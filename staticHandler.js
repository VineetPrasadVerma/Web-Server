const fs = require('fs').promises

const contentType = {
  js: 'application/js',
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  json: 'application/json',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png'
}

const serveStaticFile = async (requestObj, respObj) => {
  let res = null
  try {
    if (requestObj.method === 'GET') {
      if (requestObj.requestUri === '/') {
        res =
      'HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
        const date = new Date()
        res += `Date: ${date.toUTCString()}\r\n`
        res += `Content-Type: ${contentType.html}\r\n`
        const body = await fs.readFile('./index.html')
        res += `Content-Length: ${body.length}\r\n\r\n`
        res += body
      }
      return res
    }
    return null
  } catch (err) {
    return null
  }
}

module.exports = { serveStaticFile }
