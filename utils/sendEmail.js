const nodemailer = require('nodemailer')
const nodemailerConfig = require('../config/nodemailer')

const sendEmail = async ({ to, subject, html }) => {
  // eslint-disable-next-line no-unused-vars
  let testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport(nodemailerConfig)

  return transporter.sendMail({
    from: 'Notification <notifications@eleven.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  })
}

module.exports = sendEmail
