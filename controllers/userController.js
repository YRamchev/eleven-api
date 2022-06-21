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
  res.send('Show current users')
}

const updateUser = async (req, res) => {
  res.send('Update user')
}

const updateUserPassword = async (req, res) => {
  res.send('update user password')
}

module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }