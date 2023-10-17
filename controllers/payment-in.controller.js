const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addPaymentIn = (req, res) => {
  try{
    const {receipt_no, date, party_name, amount}= req.body;
    const queryParams = [receipt_no, date, party_name, amount];
    const query = 'INSERT INTO payment_in (receipt_no, date, party_name, amount) VALUES (?, ?, ?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Payment In added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllPaymentIn = (req, res) => {
  try{
   
    const query = 'SELECT * FROM payment_in';
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