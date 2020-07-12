const fs = require('fs').promises

const bodyParser = async (reqObj, resObj, next) => {
  if (!reqObj.body) {
    reqObj.body = {}
    return undefined
  }

  const contentType = reqObj.headers['Content-Type']

  if (contentType === 'application/json') {
    reqObj.body = JSON.parse(reqObj.body.toString())
  }

  if (contentType === 'text/plain') {
    reqObj.body = reqObj.body.toString()
  }

  if (contentType === 'application/x-www-form-urlencoded') {
    const body = {}
    const formData = reqObj.body.toString().split('&')
    for (const data of formData) {
      const [key, value] = data.split('=')
      body[key] = value
    }

    reqObj.body = body
  }

  if (contentType.startsWith('multipart/form-data')) {
    const body = {}
    const boundary = `--${contentType.split('; boundary=')[1]}`
    const bodyParts = reqObj.body.toString('binary').split(boundary).slice(1, -1)
    // console.log(bodyParts)
    for (const part of bodyParts) {
      const [headers, data] = part.split(/\r\n\r\n/)
      const headerArray = headers.split(/;|\r\n/).slice(1)

      const headersObj = {}
      for (const item of headerArray) {
        const [key, value] = item.split(/:|=/)
        headersObj[key.trim()] = value.trim('"')
      }

      if (headersObj.filename && headersObj.filename !== '""') {
        try {
          // console.log(Buffer.from(data))
          await fs.writeFile(`./upload/${headersObj.filename.slice(1, -1)}`, Buffer.from(data, 'binary'))
        } catch (err) {
          console.log(err)
          return null
        }
      } else {
        Object.assign(body, { [headersObj.name.slice(1, -1)]: data.replace(/\r\n/, '') })
      }
    }

    reqObj.body = body
  }
}

module.exports = { bodyParser }
