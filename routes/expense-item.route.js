const express = require('express');

const { addExpenseItem, getAllExpenseItems } = require('../controllers/expense-item.controller');

const router = express.Router();


router.post('/', addExpenseItem);
router.get('/', getAllExpenseItems);

module.exports = router;
