const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  toAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['ARS', 'USD'], default: 'ARS' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  scheduledDate: Date,
  executedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
