const express = require('express');
const { addPaymentIn, getAllPaymentIn } = require('../controllers/payment-in.controller');

const router = express.Router();


router.post('/', addPaymentIn);
router.get('/', getAllPaymentIn);

module.exports = router;
