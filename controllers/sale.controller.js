const { pool } = require('../config/sql.config');
const { stockOut } = require('./stock.controller');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addSale = (req, res) => {
  try{
    const {bill_no, date, party_name, items, GSTIN, state_of_supply, additional_charges, sale_bill_amount, payment_mode, due_date, note_reference_no, received_amount, balance_due}= req.body.saleDetails;
    const {custom_field, your_address, terms_condition}= req.body.optionalFields;
    const queryParams = [bill_no, date, party_name, JSON.stringify(items), GSTIN, state_of_supply, JSON.stringify(additional_charges), sale_bill_amount, payment_mode, due_date, note_reference_no, received_amount, balance_due, JSON.stringify(custom_field), JSON.stringify(your_address), terms_condition];
    const query = 'INSERT INTO sales (bill_no, date, party_name, items, GSTIN, state_of_supply, additional_charges, sale_bill_amount, payment_mode, due_date, note_reference_no, received_amount, balance_due, custom_field, your_address, terms_condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      stockOut(items.item_name, items.quantity);
      return res.status(200).json({ message: 'Sale added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllSales = (req, res) => {
  try{
   
    const query = 'SELECT * FROM sales';
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