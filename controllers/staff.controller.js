const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addStaff = (req, res) => {
  try{
    const {name, phone_number}= req.body;
    const queryParams = [name, phone_number];
    const query = 'INSERT INTO staff (name, phone_number) VALUES (?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Staff added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllStaff = (req, res) => {
  try{
   
    const query = 'SELECT * FROM staff';
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