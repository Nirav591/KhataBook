const express = require('express');
const { addStockOut } = require('../controllers/stock-out.controller');

const router = express.Router();


router.post('/', addStockOut);

module.exports = router;
