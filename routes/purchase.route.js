const express = require('express');
const { addPurchase, getAllPurchase } = require('../controllers/purchase.controller');

const router = express.Router();


router.post('/', addPurchase);
router.get('/', getAllPurchase);

module.exports = router;
