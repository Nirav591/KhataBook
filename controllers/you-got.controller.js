const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addGotTransaction = (req, res) => {
  try{    
    const { name, amount, date } = JSON.parse(req.body.amountDetails);
    const { details, bill_no } = JSON.parse(req.body.billDetails);
    const queryParams = [name, amount, date, details, bill_no];
    let query = 'INSERT INTO got_transaction (name, amount, date, details, bill_no) VALUES (?, ?, ?, ?, ?)';
 
    if(req.file){
      const { filename } = req.file;
      const imageFilePath = `uploads/${filename}`;
      queryParams.push(imageFilePath);
      query = 'INSERT INTO got_transaction (name, amount, date, details, bill_no, bill_img) VALUES (?, ?, ?, ?, ?, ?)';
    }

    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Got transaction added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getGotTransactionById = (req, res) => {
  try{   
    const id = req.params.id;
    const query = 'SELECT * FROM got_transaction WHERE id = ?';
    pool.query(query, [id], (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json(result);  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.updateGotTransaction = (req, res) => {
  try{   
    const transactionId = req.params.id; 
    const { name, amount, date } = JSON.parse(req.body.amountDetails);
    const { details, bill_no } = JSON.parse(req.body.billDetails);
    const queryParams = [name, amount, date, details, bill_no];
    let query = 'UPDATE got_transaction SET name = ?, amount = ?, date = ?, details = ?, bill_no = ? WHERE id = ?';
 
    if(req.file){
      const { filename } = req.file;
      const imageFilePath = `uploads/${filename}`;
      queryParams.push(imageFilePath);
      query = 'UPDATE got_transaction SET name = ?, amount = ?, date = ?, details = ?, bill_no = ?, bill_img = ? WHERE id = ?';
    }
    queryParams.push(transactionId);

    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Got transaction updated successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.deleteGotTransaction = (req, res) => {
  try{   
    const id = req.params.id;
    const query = 'DELETE FROM got_transaction WHERE id = ?';
    pool.query(query, [id], (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Got transaction deleted successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}