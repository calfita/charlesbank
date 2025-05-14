const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Credential = require('../models/Credential');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Transfer = require('../models/Transfer');
const LogActivity = require('../models/LogActivity');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 Conectado a MongoDB');

    // Limpiar colecciones (opcional en desarrollo)
    await Promise.all([
      User.deleteMany({}),
      Credential.deleteMany({}),
      Account.deleteMany({}),
      Transaction.deleteMany({}),
      Transfer.deleteMany({}),
      LogActivity.deleteMany({})
    ]);

    // Crear usuario
    const user = await User.create({
      fullName: 'Juan Pérez',
      email: 'juanperez@example.com',
      dni: '12345678',
      phone: '1122334455',
      address: 'Calle Falsa 123',
      role: 'client',
      status: 'active'
    });

    // Hashear contraseña
    const passwordHash = await bcrypt.hash('asd', 10);

    await Credential.create({
      userId: user._id,
      username: 'juanperez@example.com',
      passwordHash, // ← este debe tener valor, no undefined
    });

    // Crear cuenta principal
    const account = await Account.create({
      userId: user._id,
      type: 'savings',
      alias: 'juanperez.savings',
      cbu: '0000111122223333444455',
      balance: 20000,
      currency: 'ARS',
      status: 'active'
    });

    // Transacciones base
    await Transaction.create([
      {
        accountId: account._id,
        type: 'deposit',
        amount: 20000,
        currency: 'ARS',
        concept: 'Depósito inicial'
      },
      {
        accountId: account._id,
        type: 'withdrawal',
        amount: 5000,
        currency: 'ARS',
        concept: 'Extracción en cajero'
      }
    ]);

    // Otra cuenta para transferencias
    const anotherAccount = await Account.create({
      userId: user._id,
      type: 'checking',
      alias: 'juanperez.checking',
      cbu: '0000999988887777666611',
      balance: 0,
      currency: 'ARS',
      status: 'active'
    });

    const transfer = await Transfer.create({
      fromAccountId: account._id,
      toAccountId: anotherAccount._id,
      amount: 3000,
      currency: 'ARS',
      status: 'completed',
      executedAt: new Date()
    });

    await Transaction.create([
      {
        accountId: account._id,
        type: 'transfer_out',
        amount: 3000,
        currency: 'ARS',
        concept: 'Transferencia a cuenta corriente',
        relatedTransferId: transfer._id
      },
      {
        accountId: anotherAccount._id,
        type: 'transfer_in',
        amount: 3000,
        currency: 'ARS',
        concept: 'Transferencia recibida',
        relatedTransferId: transfer._id
      }
    ]);

    await LogActivity.create({
      userId: user._id,
      action: 'SEED_CREATED',
      metadata: { accounts: 2, transactions: 4 },
      ipAddress: '127.0.0.1',
      userAgent: 'seed-script'
    });

    console.log('✅ Seed completo.');
    process.exit(0);
  } catch (err) {
    console.error('🔴 Error en el seed:', err);
    process.exit(1);
  }
}

seed();
