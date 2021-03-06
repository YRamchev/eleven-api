const User = require('../models/User')
const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')
const crypto = require('crypto')
const {
  sendUserVerificationEmail,
  sendUserPasswordResetEmail,
  createHash,
} = require('../emails')

const register = async (req, res) => {
  const { email, name, password } = req.body
  const emailAlreadyExists = await User.findOne({ email })

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already taken')
  }

  const verificationToken = crypto.randomBytes(40).toString('hex')
  const user = await User.create({ name, email, password, verificationToken })

  await sendUserVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: 'http://localhost:3000',
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
    verificationToken: user.verificationToken,
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      'Please provide email address and password!'
    )
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid credentials!')
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials!')
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError(
      'Please verify your email address!'
    )
  }

  const tokenUser = createTokenUser(user)

  // create refresh token
  let refreshToken = ''
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id })

  if (existingToken) {
    const { isValid } = existingToken

    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }

    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
    return
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = { refreshToken, ip, userAgent, user: user._id }
  await Token.create(userToken)
  attachCookiesToResponse({ res, user: tokenUser, refreshToken })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError(
      `User with email ${email} not found!`
    )
  }

  if (verificationToken !== user.verificationToken) {
    throw new CustomError.BadRequestError('Token does not match!')
  }

  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ''

  await user.save()

  res
    .status(StatusCodes.OK)
    .json({ msg: `User with ${email} is verification successful.` })
}

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId })

  res.clearCookie('accessToken', {
    httpOnly: true,
  })

  res.clearCookie('refreshToken', {
    httpOnly: true,
  })

  res.status(StatusCodes.OK).json({ msg: 'User logged out' })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new CustomError.BadRequestError('Please provide email address!')
  }

  const user = await User.findOne({ email })

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex')
    // Send email
    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now + tenMinutes)

    await sendUserPasswordResetEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin: 'http://localhost:3000',
    })

    user.passwordToken = createHash(passwordToken)
    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    await user.save()
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password!' })
}

const resetPassword = async (req) => {
  const { token, email, password } = req.body

  if (!token || !email || password) {
    throw new CustomError.BadRequestError(
      'Please provide token, email and password!'
    )
  }

  const user = await User.findOne({ email })

  if (user) {
    const currentDate = new Date()
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password
      user.passwordToken = null
      user.passwordTokenExpirationDate = null
      await user.save()
    }
  }
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
}
