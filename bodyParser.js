const fs = require('fs')

const bodyParser = (reqObj, resObj, next) => {
  if (!reqObj.body) {
    reqObj.body = {}
    return undefined
  }

  const contentType = reqObj.headers['Content-type']

  if (contentType === 'application/json') {
    reqObj.body = JSON.parse(reqObj.body)
  }

  if (contentType === 'text/plain') {
    reqObj.body = reqObj.body.toString()
  }

  if (contentType === 'application/x-www-form-urlencoded') {
    const body = {}
    const formData = reqObj.body.split('&')
    for (const data of formData) {
      const [key, value] = data.split('=')
      body[key] = value
    }

    reqObj.body = body
  }

  if (contentType.startsWith('multipart/form-data')) {
    const body = {}
    const boundary = `--${contentType.split('; boundary=')[1]}`
    const bodyParts = reqObj.body.split(boundary).slice(1, -1)

    for (const part of bodyParts) {
      const [headers, data] = part.split(/\r\n\r\n/)
      const headerArray = headers.split(/;|\r\n/)

      const headersObj = {}
      for (const item of headerArray) {
        const [key, value] = item.split(/:|=/)
        headersObj[key] = value
      }

      if (headersObj.filename) {
        fs.writeFile(`./upload/${headersObj.filename}`, data, (err) => { console.log(err) })
      } else {
        Object.assign(body, { [headersObj.filename]: data })
      }
    }

    reqObj.body = body
  }
}

module.exports = { bodyParser }
