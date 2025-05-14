const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dni: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
