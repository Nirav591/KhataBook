const express = require('express');
const { addStaff, getAllStaff } = require('../controllers/staff.controller');


const router = express.Router();


router.post('/', addStaff);
router.get('/', getAllStaff);

module.exports = router;
