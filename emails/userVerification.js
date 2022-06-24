const sendEmail = require('../utils/sendEmail')

const sendVerificationEmail = async ({
  name,
  email,
  origin,
  verificationToken,
}) => {
  const verifyLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`

  const message = `Hello ${name}, please confirm email <a href="${verifyLink}">Click here to verify email</a>`

  return await sendEmail({
    to: email,
    subject: 'Email confirmation',
    html: message,
  })
}

module.exports = sendVerificationEmail
