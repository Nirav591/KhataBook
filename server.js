const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth.route');
const customerRoute = require('./routes/customer.route');
const supplierRoute = require('./routes/supplier.route');
const staffRoute = require('./routes/staff.route');
const saleRoute = require('./routes/sale.route');
const saleReturnRoute = require('./routes/sale-return.route');
const paymentInRoute = require('./routes/payment-in.route');
const purchaseRoute = require('./routes/purchase.route');
const purchaseReturnRoute = require('./routes/purchase-return.route');
const paymentOutRoute = require('./routes/payment-out.route');
const expenseRoute = require('./routes/expense.route');
const expenseCategoryRoute = require('./routes/expense-category.route');
const expenseItemRoute = require('./routes/expense-item.route');
const itemRoute = require('./routes/item.route');
const stockInRoute = require('./routes/stock-in.route');
const stockOutRoute = require('./routes/stock-out.route');
const businessProfileRoute = require('./routes/business-profile.route');
const cashbookRoute = require('./routes/cashbook.route');
const userRoute = require('./routes/user.route');
const gaveTransactionRoute = require('./routes/you-gave.route');
const gotTransactionRoute = require('./routes/you-got.route');

const { verifyToken } = require('./middlewares/verify-token');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/auth', authRoute);
app.use('/customer', verifyToken, customerRoute);
app.use('/supplier', verifyToken, supplierRoute);
app.use('/staff', verifyToken, staffRoute);
app.use('/sale', verifyToken, saleRoute);
app.use('/sale-return', verifyToken, saleReturnRoute);
app.use('/payment-in', verifyToken, paymentInRoute);
app.use('/purchase', verifyToken, purchaseRoute);
app.use('/purchase-return', verifyToken, purchaseReturnRoute);
app.use('/payment-out', verifyToken, paymentOutRoute);
app.use('/expense', verifyToken, expenseRoute);
app.use('/expense-category', verifyToken, expenseCategoryRoute);
app.use('/expense-item', verifyToken, expenseItemRoute);
app.use('/item', verifyToken, itemRoute);
app.use('/stock-in', verifyToken, stockInRoute);
app.use('/stock-out', verifyToken, stockOutRoute);
app.use('/business-profile', verifyToken, businessProfileRoute);
app.use('/cashbook', verifyToken, cashbookRoute);
app.use('/users', verifyToken, userRoute);
app.use('/you-gave', verifyToken, gaveTransactionRoute);
app.use('/you-got', verifyToken, gotTransactionRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
