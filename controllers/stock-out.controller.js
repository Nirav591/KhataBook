const { pool } = require('../config/sql.config');
const { stockOut } = require('./stock.controller');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addStockOut = (req, res) => {
  try{
    const {item_name, quantity_sold, sale_price, stock_out_date, notes}= req.body.stockDetails;
    const queryParams = [item_name, quantity_sold, sale_price, stock_out_date, notes];
    const query = 'INSERT INTO stock_out (item_name, quantity_sold, sale_price, stock_out_date, notes) VALUES (?, ?, ?, ?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      stockOut(item_name, quantity_sold);
      return res.status(200).json({ message: 'Stock reduced successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

