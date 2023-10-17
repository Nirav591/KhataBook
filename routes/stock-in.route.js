const express = require('express');
const { addStockIn } = require('../controllers/stock-in.controller');

const router = express.Router();


router.post('/', addStockIn);

module.exports = router;
