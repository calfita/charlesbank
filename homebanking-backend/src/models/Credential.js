const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  lastLogin: Date,
  failedAttempts: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Credential', credentialSchema);
