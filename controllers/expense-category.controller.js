const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addExpenseCategory = (req, res) => {
  try{
    const {category_name}= req.body;
    const queryParams = [category_name];
    const query = 'INSERT INTO expense_category (category_name) VALUES (?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Expense Category added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllExpenseCategory = (req, res) => {
  try{
   
    const query = 'SELECT * FROM expense_category';
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