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
}

module.exports = { bodyParser }
