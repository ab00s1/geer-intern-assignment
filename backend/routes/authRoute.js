const express = require('express');
const { register, signin, forgot, logout } = require('../middleware/Authentication');
const router = express.Router();

// register new user
router.post('/register', register);

// login existing user
router.post('/signin', signin);

// change password
router.post('/forgotPassword', forgot);

// logout user
router.post('/logout', logout);

module.exports = router;