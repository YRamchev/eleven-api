const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const register = async (req, res) => {
  const { email, name, password } = req.body
  const emailAlreadyExists = await User.findOne({ email })

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already taken')
  }

  const verificationToken = 'fakeToken'
  const user = await User.create({ name, email, password, verificationToken })

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
    verificationToken: user.verificationToken,
  })

  // const tokenUser = createTokenUser(user)
  // attachCookiesToResponse({ res, user: tokenUser })
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
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
  })

  res.status(StatusCodes.OK).json({ msg: 'User logged out' })
}

module.exports = { register, login, logout }
