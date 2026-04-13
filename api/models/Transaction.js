const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  type: String, // 🔥 ADD THIS
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);