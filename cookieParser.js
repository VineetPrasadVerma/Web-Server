const cookieParser = (reqObj, resObj, next) => {
  if (!reqObj.headers.Cookie) return undefined
  const cookies = reqObj.headers.Cookie.split(';')
  reqObj.Cookie = {}

  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    reqObj.Cookie[key.trim()] = value.trim()
  }
}

module.exports = { cookieParser }
