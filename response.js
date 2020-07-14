const fs = require('fs').promises

const errorResponse = async () => {
  try {
    let res =
      'HTTP/1.1 404 NOT FOUND\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
    const date = new Date()
    res += `Date: ${date.toUTCString()}\r\n`
    res += 'Content-Type: text/html\r\n'
    const body = await fs.readFile('./error.html')
    res += `Content-Length: ${body.length}\r\n\r\n`
    res += body

    return res
  } catch (err) {
    let res =
      'HTTP/1.1 500 SERVER ERROR\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n'
    const date = new Date()
    res += `Date: ${date.toUTCString()}\r\n`
    res += 'Content-Type: text/html\r\n'
    const body =
      '<html><head><title>Server Erorr</title></head><body><h1>Internal Server Error</h1></body></html>'
    res += `Content-Length: ${body.length}\r\n\r\n`
    res += body
    return res
  }
}

function status (code) {
  let resp = `HTTP/1.1 ${code} OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, Content-Type, Accept\r\n`
  const date = new Date()
  resp += `Date: ${date.toUTCString()}\r\n`
  resp += 'Content-Type: *\r\n'

  this.resp = resp
  return this
}

function send (body) {
  body = JSON.stringify(body)
  if (this.cookies) this.resp += this.cookies
  this.resp += `Content-Length: ${body.length}\r\n\r\n`
  this.resp += body

  return this
}

function cookie (key, value, props) {
  const cookie = `Set-Cookie: ${key}=${value}${setCookieProperties(props)}\r\n`
  if (this.cookies) {
    this.cookies += cookie
  } else {
    this.cookies = cookie
  }
}

function setCookieProperties (props) {
  if (!props) return ''
  let properties = ''
  for (const [name, value] of Object.entries(props)) {
    properties += '; ' + name + '=' + value
  }

  return properties
}

module.exports = { errorResponse, status, send, cookie }
