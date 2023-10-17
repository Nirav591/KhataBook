const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addBusinessProfile, getBusinessProfile, updateBusinessProfile } = require('../controllers/business-profile.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), addBusinessProfile);
router.get('/', getBusinessProfile);
router.put('/', upload.single('image'), updateBusinessProfile);


module.exports = router;
