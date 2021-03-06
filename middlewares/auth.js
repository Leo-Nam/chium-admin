const jwt = require('jsonwebtoken')
const jwtFromModule = require('../modules/jwt.js')
const { secretKey } = require('../config/secretKey')

const checkToken = async function (req, res, next) {
  const token = req.headers.token

  let userId = req.body.userId
  if (userId) {
    const token = await jwtFromModule.sign(userId)
    res.send({ token: token })
    return
  }

  // 토큰 없음
  if (token === 'null') {
    if (req.url == '/api/admin/common/admin_login') {
      next()
      return
    }
    res.send({ errcode: 'null' })
    return
  } else {
    await jwt.verify(token, secretKey, function (err, de) {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          //시간 만료
          res.send({ errcode: 'expired' })
          return
        }
        res.send({ errcode: 'invalid' })
        return
      }
      next()
      return
    })
  }
  // decode
}

module.exports = checkToken
