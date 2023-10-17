const express = require('express');
const { addPaymentOut, getAllPaymentOut } = require('../controllers/payment-out.controller');

const router = express.Router();


router.post('/', addPaymentOut);
router.get('/', getAllPaymentOut);

module.exports = router;
