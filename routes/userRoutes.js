const express = require("express");
const router = express.Router();
const { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require("../controllers/userController")
const { authenticateUser, authorizePermissions } = require("../middleware/authentication")

router.route("/").get(authenticateUser, authorizePermissions, getAllUsers)

router.route('/me').get(showCurrentUser)
router.route('/updateUser').post(updateUser)
router.route('/updateUserPassword').post(updateUserPassword)

router.route("/:id").get(authenticateUser, getSingleUser)

module.exports = router
