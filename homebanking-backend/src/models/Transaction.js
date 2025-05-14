const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer_in', 'transfer_out'],
    required: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['ARS', 'USD'], default: 'ARS' },
  concept: String,
  relatedTransferId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transfer' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
