const express = require('express');

const { addExpense, getAllExpenses } = require('../controllers/expense.controller');

const router = express.Router();


router.post('/', addExpense);
router.get('/', getAllExpenses);

module.exports = router;
