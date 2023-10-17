const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addGotTransaction, getGotTransactionById, updateGotTransaction, deleteGotTransaction } = require('../controllers/you-got.controller');

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

router.post('/', upload.single('image'), addGotTransaction);
router.get('/:id', getGotTransactionById);
router.put('/:id', upload.single('image'), updateGotTransaction);
router.delete('/:id', deleteGotTransaction);

module.exports = router;
