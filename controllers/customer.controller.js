const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addCustomer = (req, res) => {
  try{
    const {name, phone_number}= req.body.customer;
    const {gstin, billing_address}= req.body.address;
    const queryParams = [name, phone_number, gstin, JSON.stringify(billing_address)];
    const query = 'INSERT INTO customers (name, phone_number, gstin, address) VALUES (?, ?, ?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Customer added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await new Promise((resolve, reject) => {
      pool.query('SELECT DISTINCT name FROM customers', (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    const customerData = await Promise.all(
      customers.map(async (customer) => {
        const customerName = customer.name;
        const gaveTransactionPromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM gave_transaction WHERE name = ?`, [customerName], (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
          });
        });

        const gotTransactionPromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM got_transaction WHERE name = ?`, [customerName], (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });

        const paymentInPromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM payment_in WHERE party_name = ?`, [customerName], (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });

        const salePromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM sales WHERE party_name = ?`, [customerName], (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });

        const saleReturnPromise = new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM sale_return WHERE party_name = ?`, [customerName], (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });
        
        const [gaveTransaction, gotTransaction, sales, saleReturn, paymentIn] = await Promise.all([
          gaveTransactionPromise,
          gotTransactionPromise,
          salePromise,
          saleReturnPromise,
          paymentInPromise
        ]);

        let amount = 0;
        const due_date = [];
        if(sales){
          sales?.map(amt =>{
            due_date.push(amt.due_date);
            return amount += amt.sale_bill_amount;
          })
        }
        if(saleReturn){
          saleReturn?.map(amt =>{
            return amount -= amt.diff_amount;
          })
        }
        if(paymentIn){
          paymentIn?.map(amt =>{
            return amount -= amt.amount;
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
            customer_name: customerName,
            gave_transaction: gaveTransaction,
            got_transaction: gotTransaction,
            payment_in_transaction: paymentIn,
            sale_transaction: sales,
            sale_return_transaction: saleReturn,
            due_date: due_date,
            willGiveAmount: -amount,
            willGotAmount: amount,
          };
      })
    );
    return res.status(200).json(customerData);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
};