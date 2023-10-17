const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addCashbookEntry = (req, res) => {
  try{
    const { amount, payment_mode, details, date, type } = JSON.parse(req.body.entryDetails);
    const queryParams = [amount, payment_mode, details, date, type];
    let query = 'INSERT INTO cashbook (amount, payment_mode, details, date, type) VALUES (?, ?, ?, ?, ?)';
    
    if(req.file){
      const { filename } = req.file;
      const imageFilePath = `uploads/${filename}`;
      queryParams.push(imageFilePath);
      query = 'INSERT INTO cashbook (amount, payment_mode, details, date, type, bill_img) VALUES (?, ?, ?, ?, ?, ?)';
    }
    
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Cashbook entry added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllCashbookEntry = (req, res) => {
  try{
   
    const query = 'SELECT * FROM cashbook';
    pool.query(query, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json(result);  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}