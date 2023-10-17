const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addExpenseItem = (req, res) => {
  try{
    const {item_name, item_rate}= req.body;
    const queryParams = [item_name, item_rate];
    const query = 'INSERT INTO expense_item (item_name, item_rate) VALUES (?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Expense Item added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllExpenseItems = (req, res) => {
  try{
   
    const query = 'SELECT * FROM expense_item';
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