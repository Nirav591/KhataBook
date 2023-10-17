const { pool } = require('../config/sql.config');
const { stockIn } = require('./stock.controller');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addPurchase = (req, res) => {
  try{
    const {purchase_no, date, party_name, items, additional_charges, discount, purchase_amount, payment_mode, due_date, note_reference_no, paid_amount, balance_due}= req.body.purchaseDetails;
    const {custom_field, supplier_address, your_address, terms_condition}= req.body.optionalFields;
    const queryParams = [purchase_no, date, party_name, JSON.stringify(items), JSON.stringify(additional_charges), discount, purchase_amount, payment_mode, due_date, note_reference_no, paid_amount, balance_due, JSON.stringify(custom_field), JSON.stringify(supplier_address), JSON.stringify(your_address), terms_condition];
    const query = 'INSERT INTO purchase (purchase_no, date, party_name, items, additional_charges, discount, purchase_amount, payment_mode, due_date, note_reference_no, paid_amount, balance_due, custom_field, supplier_address, your_address, terms_condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      stockIn(items.item_name, items.quantity);
      return res.status(200).json({ message: 'Purchase added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllPurchase = (req, res) => {
  try{   
    const query = 'SELECT * FROM purchase';
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