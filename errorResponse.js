const fs = require('fs').promises

const errorResponse = async () => {
  let res =
    'HTTP/1.1 404 NOT FOUND\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
  const date = new Date()
  res += `Date: ${date.toUTCString()}\r\n`
  res += 'Content-Type: text/html\r\n'
  const body = await fs.readFile('../error.html')
  res += `Content-Length: ${body.length}\r\n\r\n`
  res += body

  return res
}

module.exports = { errorResponse }
