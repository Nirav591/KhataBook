const express = require('express');

const { addExpenseCategory, getAllExpenseCategory } = require('../controllers/expense-category.controller');

const router = express.Router();


router.post('/', addExpenseCategory);
router.get('/', getAllExpenseCategory);

module.exports = router;
