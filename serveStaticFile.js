const fs = require('fs').promises
const path = require('path')

const contentType = {
  js: 'application/js',
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  json: 'application/json',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg'
}

const getContentType = (uri) => {
  const type = contentType[path.extname(uri).slice(1)]
  if (type === '') {
    throw new Error('Invalid Content type')
  }
  return type
}

const createResponse = async (requestObj) => {
  let res = ''
  if (requestObj.method === 'GET') {
    if (requestObj.requestUri === '/') {
      res +=
      'HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
      res += `Content-Type: ${contentType.html}\r\n`
      const body = await fs.readFile('./index.html')
      res += `Content-Length: ${body.length}\r\n\r\n`
      res += body
    } else {
      res += 'HTTP/1.1 404 NOT FOUND\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
      res += `Content-Type: ${contentType.txt}\r\n`
      res += 'Content-Length:14\r\n\r\n'
      res += 'File Not Found'
    }
  } else {
    res += 'HTTP/1.1 405 METHOD NOT ALLOWED\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
    res += `Content-Type: ${contentType.html}\r\n`
    const body = await fs.readFile('./error.html')
    res += `Content-Length: ${body.length}\r\n\r\n`
    res += body
  }

  return res
}

module.exports = { createResponse }
