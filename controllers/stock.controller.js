const { pool } = require('../config/sql.config');

async function initializeStockFromDatabase(item_name) {
  return new Promise((resolve, reject) => {
    pool.query('SELECT item_name, quantity FROM current_stock WHERE item_name = ?', [item_name], (err, result) => {
      if (err) {
        console.error('Error initializing stock from the database:', err);
        return reject(err);
      }
      if (result.length > 0) {
        const currentStock = result[0].quantity;
        resolve(currentStock);
      } else {
        resolve(0);
      }
    });
  });
}

// Function to update stock in the database
async function updateStockInDatabase(itemName, newQuantity) {
  try {
    await pool.query('UPDATE current_stock SET quantity = ? WHERE item_name = ?', [newQuantity, itemName]);
  } catch (error) {
    console.error('Error updating stock in the database:', error);
  }
}

// Function to add an item with opening stock
async function addItemToCurrentStock(item_name, op_stock) {
  try {
    await pool.query('INSERT INTO current_stock (item_name, quantity) VALUES (?, ?)', [item_name, JSON.parse(op_stock)]);
  } catch (error) {
    console.error('Error updating stock in the database:', error);
  } 
} 

// Function to add stock
async function stockIn(item_name, quantity) {
  const cur_stock = await initializeStockFromDatabase(item_name);
  const newStock = cur_stock + quantity;
  updateStockInDatabase(item_name, newStock);
}

// Function to remove stock
async function stockOut(item_name, quantity) {
  const cur_stock = await initializeStockFromDatabase(item_name);
  const newStock = cur_stock - quantity;
  updateStockInDatabase(item_name, newStock);
}

// Function to get the current stock of an item
async function getCurrentStock(item_name) {
  const cur_stock = await initializeStockFromDatabase(item_name);
  return cur_stock;
}

module.exports = {
  addItemToCurrentStock,
  stockIn,
  stockOut,
  getCurrentStock,
};