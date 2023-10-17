const express = require('express');
const { addSale, getAllSales } = require('../controllers/sale.controller');

const router = express.Router();


router.post('/', addSale);
router.get('/', getAllSales);

module.exports = router;
