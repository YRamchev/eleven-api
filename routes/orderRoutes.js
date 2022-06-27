const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  editOrder,
  deleteOrder,
  getCurrentUserOrders,
} = require('../controllers/orderController')

router
  .route('/')
  .post(createOrder)
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders)

router.route('/my-orders').get(authenticateUser, getCurrentUserOrders)

router
  .route('/:id')
  .get(getSingleOrder)
  .patch(authenticateUser, authorizePermissions('admin'), editOrder)
  .delete(authenticateUser, authorizePermissions('admin'), deleteOrder)

module.exports = router
