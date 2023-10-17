const express = require('express');
const { addSaleReturn, getAllSaleReturns } = require('../controllers/sale-return.controller');

const router = express.Router();


router.post('/', addSaleReturn);
router.get('/', getAllSaleReturns);

module.exports = router;
