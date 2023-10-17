const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addGaveTransaction, getGaveTransactionById, updateGaveTransaction, deleteGaveTransaction } = require('../controllers/you-gave.controller');

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

router.post('/', upload.single('image'), addGaveTransaction);
router.get('/:id', getGaveTransactionById);
router.put('/:id', upload.single('image'), updateGaveTransaction);
router.delete('/:id', deleteGaveTransaction);


module.exports = router;
