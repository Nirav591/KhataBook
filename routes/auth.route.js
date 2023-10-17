const express = require('express');
const router = express.Router();

const {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  validateEmail,
  verifyOTP,
} = require('../controllers/auth.controller');
const { checkUsernameOrEmail } = require('../middlewares/verify-signup');

router.post('/sign-up', checkUsernameOrEmail, createUser);
router.post('/sign-in', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', validateEmail);
router.post('/verify-otp', verifyOTP);

module.exports = router;

console.log('in auth file');
