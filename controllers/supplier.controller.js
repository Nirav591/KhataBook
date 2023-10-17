const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addSupplier = (req, res) => {
  try{
    const {name, phone_number}= req.body.supplier;
    const {gstin, billing_address}= req.body.address;
    const queryParams = [name, phone_number, gstin, JSON.stringify(billing_address)];
    const query = 'INSERT INTO suppliers (name, phone_number, gstin, address) VALUES (?, ?, ?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Supplier added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await new Promise((resolve, reject) => {
      pool.query('SELECT DISTINCT name FROM suppliers', (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    const supplierData = await Promise.all(
      suppliers.map(async (supplier) => {
        const supplierName = supplier.name;
        const gaveTransactionPromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM gave_transaction WHERE name = ?`, [supplierName], (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
          });
        });

        const gotTransactionPromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM got_transaction WHERE name = ?`, [supplierName], (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });

        const paymentOutPromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM payment_out WHERE party_name = ?`, [supplierName], (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });

        const purchasePromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM purchase WHERE party_name = ?`, [supplierName], (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });

        const purchaseReturnPromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM purchase_return WHERE party_name = ?`, [supplierName], (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });

        const [gaveTransaction, gotTransaction, purchase, purchaseReturn, paymentOut] = await Promise.all([
          gaveTransactionPromise,
          gotTransactionPromise,
          purchasePromise,
          purchaseReturnPromise,
          paymentOutPromise
        ]);

        let amount = 0;
        if(purchase){
          purchase?.map(amt =>{
            return amount -= amt.balance_due;
          })
        }
        if(purchaseReturn){
          purchaseReturn?.map(amt =>{
            return amount += amt.balance_due;
          })
        }
        if(paymentOut){
          paymentOut?.map(amt =>{
            return amount += amt.amount;
          })
        }
        if(gaveTransaction){
          gaveTransaction?.map(amt =>{
            return amount += amt.amount;
          })
        }
        if(gotTransaction){
          gotTransaction?.map(amt =>{
            return amount -= amt.amount;
          })
        }
        return {
          supplier_name: supplierName,
          gave_transaction: gaveTransaction,
          got_transaction: gotTransaction,
          payment_out_transaction: paymentOut,
          purchase_transaction: purchase,
          purchase_return_transaction: purchaseReturn,
          willGiveAmount: -amount,
          willGotAmount: amount,
        };
      })
    );
    return res.status(200).json(supplierData);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
};