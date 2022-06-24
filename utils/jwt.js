const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET)

  return token
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } })
  const refreshTokenJWt = createJWT({ payload: { user, refreshToken } })

  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: 1000 * 60 * 60
  })

  res.cookie('refreshToken', refreshTokenJWt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  })

  res.status(201).json({ user })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
}
