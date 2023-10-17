const express = require('express');
const { addSupplier, getAllSuppliers } = require('../controllers/supplier.controller');
const router = express.Router();


router.post('/', addSupplier);
router.get('/', getAllSuppliers);

module.exports = router;
