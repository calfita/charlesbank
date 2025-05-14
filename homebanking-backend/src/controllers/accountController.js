const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Obtener cuentas del usuario logueado
const getUserAccounts = async (req, res) => {
  const accounts = await Account.find({ userId: req.user._id });
  res.json(accounts);
};

// Crear nueva cuenta
const createAccount = async (req, res) => {
  const { type, currency } = req.body;

  if (!type || !currency) return res.status(400).json({ message: 'Faltan campos requeridos' });

  const alias = `${req.user.fullName.toLowerCase().split(' ')[0]}.${Date.now()}`;
  const cbu = `CBU${req.user._id.toString().slice(-10)}${Math.floor(Math.random() * 1000)}`;

  const account = await Account.create({
    userId: req.user._id,
    type,
    alias,
    cbu,
    currency,
    balance: 0,
    status: 'active'
  });

  res.status(201).json(account);
};

// Cerrar cuenta
const closeAccount = async (req, res) => {
  const { id } = req.params;

  const account = await Account.findById(id);
  if (!account || !account.userId.equals(req.user._id)) {
    return res.status(404).json({ message: 'Cuenta no encontrada o acceso no autorizado' });
  }

  if (account.balance !== 0) {
    return res.status(400).json({ message: 'La cuenta tiene saldo. Retire el dinero antes de cerrarla' });
  }

  account.status = 'closed';
  await account.save();

  res.json({ message: 'Cuenta cerrada exitosamente' });
};


const getAccountTransactions = async (req, res) => {
  try {
    const accountId = req.params.id;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });

    if (!account.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const transactions = await Transaction.find({ accountId }).sort({ createdAt: -1 }).limit(10);
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


module.exports = {
  getUserAccounts,
  createAccount,
  closeAccount,
  getAccountTransactions
};
