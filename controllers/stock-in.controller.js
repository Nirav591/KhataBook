const { pool } = require('../config/sql.config');
const { stockIn } = require('./stock.controller');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addStockIn = (req, res) => {
  try{
    const {item_name, quantity_purchased, purchase_price, stock_in_date, notes}= req.body.stockDetails;
    const queryParams = [item_name, quantity_purchased, purchase_price, stock_in_date, notes];
    const query = 'INSERT INTO stock_in (item_name, quantity_purchased, purchase_price, stock_in_date, notes) VALUES (?, ?, ?, ?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      stockIn(item_name, quantity_purchased);
      return res.status(200).json({ message: 'Stock added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

