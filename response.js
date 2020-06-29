const fs = require('fs').promises

const response = async (requestObj) => {
  let res = ''
  if (requestObj.method === 'GET') {
    if (requestObj.requestUri === '/') {
      res +=
      'HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nContent-type: text/html\r\n'
      const body = await fs.readFile('./index.html')
      res += `Content-Length: ${body.length}\r\n\r\n`
      res += body
    } else {
      res += 'HTTP/1.1 404 NOT FOUND\r\nAccess-Control-Allow-Origin: *\r\nContent-type: text/plain\r\n'
      res += 'Content-Length: 5\r\n\r\n'
      res += 'Not Found'
    }
  } else {
    res += 'HTTP/1.1 405 METHOD NOT ALLOWED\r\nContent-type: text/html\r\n'
    const body = await fs.readFile('./error.html')
    res += `Content-Length: ${body.length}\r\n\r\n`
    res += body
  }

  return res
}

module.exports = { response }
