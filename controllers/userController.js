const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }, ['_id', 'name', 'email'])

  res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: id }, ['_id', 'name', 'email'])

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id: ${id}`)
  }

  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  res.send('Update user')
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide oldPassword and newPassword!')
  }

  const user = await User.findOne({ _id: req.user.userId })

  const isPasswordCorrect = await user.comparePassword(oldPassword)

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials!')
  }

  user.password = newPassword

  await user.save()
  res.status(StatusCodes.OK).json({})
}

module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }