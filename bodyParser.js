const fs = require('fs').promises

const bodyParser = async (reqObj, resObj, next) => {
  if (!reqObj.body) {
    reqObj.body = {}
    return undefined
  }

  const contentType = reqObj.headers['Content-Type']

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
    // console.log(bodyParts)
    for (const part of bodyParts) {
      const [headers, data] = part.split(/\r\n\r\n/)
      const headerArray = headers.split(/;|\r\n/)

      const headersObj = {}
      for (const item of headerArray) {
        const [key, value] = item.split(/:|=/)
        headersObj[key.trim()] = value
      }

      // console.log(headersObj)
      if (headersObj.filename) {
        try {
          await fs.writeFile(`./upload/${headersObj.filename.slice(1, -1)}`, data)
        } catch (err) {
          console.log(err)
          return null
        }
      } else {
        Object.assign(body, { [headersObj.name.slice(1, -1)]: data })
      }
    }

    reqObj.body = body
  }
}

module.exports = { bodyParser }
