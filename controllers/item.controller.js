const { pool } = require('../config/sql.config');
const { getCurrentStock, addItemToCurrentStock } = require('./stock.controller');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addItem = (req, res) => {
  try{
    const { item_name, sale_price, purchase_price, tax_included, op_stock, unit, op_stock_date, low_stock_alert, hsn_code, gst_per } = JSON.parse(req.body.itemDetails);
    const { filename } = req.file;
    const imageFilePath = `uploads/${filename}`;

    const queryParams = [item_name, imageFilePath, sale_price, purchase_price, tax_included, op_stock, unit, op_stock_date, low_stock_alert, hsn_code, gst_per];
    const query = 'INSERT INTO items (item_name, item_image, sale_price, purchase_price, tax_included, op_stock, unit, op_stock_date, low_stock_alert, hsn_code, gst_per) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      addItemToCurrentStock(item_name, op_stock);
      return res.status(200).json({ message: 'Item added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getItemById = async (req, res) => {
  try{   
    const itemId = req.params.id;
    const query = 'SELECT * FROM items WHERE id = ?';
    pool.query(query, [itemId], async (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json(result);
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllItems = async (req, res) => {
  try{
   
    const query = 'SELECT * FROM items';
    pool.query(query, async (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }

      const itemsWithStock = [];
      for (const item of result) {
        const item_name = item.item_name; 
        const currentStock = await getCurrentStock(item_name);
        
        item.currentStock = currentStock;
        itemsWithStock.push(item);
      }

      return res.status(200).json(itemsWithStock);
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}