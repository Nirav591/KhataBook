const { pool } = require('../config/sql.config');
const { stockOut } = require('./stock.controller');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addPurchaseReturn = (req, res) => {
  try{
    const {purchase_return_no, date, invoice_no, invoice_date, party_name, items, additional_charges, discount, total_amount, return_type, note_reference_no, bal_due}= req.body.purchaseReturnDetails;
    const queryParams = [purchase_return_no, date, invoice_no, invoice_date, party_name, JSON.stringify(items), JSON.stringify(additional_charges), discount, total_amount, return_type, note_reference_no, bal_due];
    const query = 'INSERT INTO purchase_return (purchase_return_no, date, invoice_no, invoice_date, party_name, items, additional_charges, discount, total_amount, return_type, note_reference_no, balance_due) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      stockOut(items.item_name, items.quantity);
      return res.status(200).json({ message: 'Purchase Return added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllPurchaseReturns = (req, res) => {
  try{
   
    const query = 'SELECT * FROM purchase_return';
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