const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['savings', 'checking'], required: true },
  alias: { type: String, unique: true },
  cbu: { type: String, unique: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, enum: ['ARS', 'USD'], default: 'ARS' },
  status: { type: String, enum: ['active', 'pending', 'closed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
