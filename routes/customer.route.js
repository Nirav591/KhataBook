const express = require('express');

const { addCustomer, getAllCustomers } = require('../controllers/customer.controller');

const router = express.Router();


router.post('/', addCustomer);
router.get('/', getAllCustomers);

module.exports = router;
