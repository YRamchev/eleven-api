const CustomError = require('../errors')

const checkPermissions = (requestUser, resouceUserId) => {
  if (requestUser.role === 'admin') return

  if (requestUser.userId === resouceUserId.toString()) return

  throw new CustomError.UnauthorizedError('Not autorized to access this route!')
}

module.exports = checkPermissions