const { pool } = require('../config/sql.config');
const { stockIn } = require('./stock.controller');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addSaleReturn = (req, res) => {
  try{
    const {sale_return_no, date, invoice_no, invoice_date, party_name, items, additional_charges, discount, total_amount, return_type, note_reference_no, diff_amount}= req.body.saleReturnDetails;
    const queryParams = [sale_return_no, date, invoice_no, invoice_date, party_name, JSON.stringify(items), JSON.stringify(additional_charges), discount, total_amount, return_type, note_reference_no, diff_amount];
    const query = 'INSERT INTO sale_return (sale_return_no, date, invoice_no, invoice_date, party_name, items, additional_charges, discount, total_amount, return_type, note_reference_no, diff_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      stockIn(items.item_name, items.quantity);
      return res.status(200).json({ message: 'Sale Return added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllSaleReturns = (req, res) => {
  try{
   
    const query = 'SELECT * FROM sale_return';
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