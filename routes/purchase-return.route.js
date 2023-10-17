const express = require('express');
const { addPurchaseReturn, getAllPurchaseReturns } = require('../controllers/purchase-return.controller');

const router = express.Router();


router.post('/', addPurchaseReturn);
router.get('/', getAllPurchaseReturns);

module.exports = router;
