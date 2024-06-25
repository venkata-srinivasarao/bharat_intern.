const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moneytracker', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        const balance = transactions.reduce((acc, transaction) => {
            return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
          }, 0);
          res.render('index', { transactions, balance });
      } catch (error) {
          res.status(500).send(error.message);
      }
  });
  
  app.get('/add', (req, res) => {
      res.render('add-transaction');
  });
  
  app.post('/transactions', async (req, res) => {
      const { type, amount, description } = req.body;
      const transaction = new Transaction({ type, amount, description });
  
      try {
          await transaction.save();
          res.redirect('/');
        } catch (error) {
          res.status(400).send('Error adding transaction: ' + error.message);
      }
  });
  
  // Start server
  app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
  });  