const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const Transfer = require("../models/Transfer");

// ✅ Obtener transacciones de una cuenta específica
const getTransactionsByAccount = async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findById(accountId);
  if (!account || !account.userId.equals(req.user._id)) {
    return res
      .status(403)
      .json({ message: "Acceso no autorizado a esta cuenta" });
  }

  const transactions = await Transaction.find({ accountId }).sort({
    timestamp: -1,
  });
  res.json(transactions);
};

// ✅ Obtener últimos X movimientos del usuario
const getRecentTransactions = async (req, res) => {
  const userAccounts = await Account.find({ userId: req.user._id }).select(
    "_id"
  );
  const accountIds = userAccounts.map((acc) => acc._id);

  const transactions = await Transaction.find({
    accountId: { $in: accountIds },
  })
    .sort({ timestamp: -1 })
    .limit(10);

  res.json(transactions);
};

const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account)
      return res.status(404).json({ message: "Cuenta no encontrada" });

    // Verificá que la cuenta sea del usuario logueado
    if (!account.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const transferOwnAccounts = async (req, res) => {
  const { fromAccountId, toAccountId, amount, currency, concept } = req.body;

  if (!fromAccountId || !toAccountId || !amount) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  if (fromAccountId === toAccountId) {
    return res
      .status(400)
      .json({ message: "Las cuentas no pueden ser iguales" });
  }

  try {
    const from = await Account.findById(fromAccountId);
    const to = await Account.findById(toAccountId);

    if (!from || !to)
      return res.status(404).json({ message: "Cuentas no encontradas" });

    if (!from.userId.equals(req.user._id) || !to.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (from.currency !== to.currency) {
      return res
        .status(400)
        .json({ message: "Las cuentas deben tener la misma moneda" });
    }

    if (from.balance < amount) {
      return res.status(400).json({ message: "Saldo insuficiente" });
    }

    // Actualizar saldos
    from.balance -= amount;
    to.balance += Number(amount);

    await from.save();
    await to.save();

    // Registrar transacciones
    await Transfer.create({
      fromAccountId: from._id,
      toAccountId: to._id,
      amount,
      currency,
      concept: concept || "Transferencia entre cuentas propias",
      status: "completed",
      initiatedAt: new Date(),
      executedAt: new Date(),
    });

    await Transaction.create({
      accountId: to._id,
      type: "transfer_in",
      amount,
      currency,
      concept: concept || "Transferencia recibida",
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Transferencia realizada" });
  } catch (err) {
    console.error("Error en transferencia:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const transferToThirdParty = async (req, res) => {
  const { fromAccountId, toCBU, amount, currency, concept } = req.body;

  if (!fromAccountId || !toCBU || !amount || !currency) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const from = await Account.findById(fromAccountId);
    if (!from || !from.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const to = await Account.findOne({
      $or: [{ cbu: toCBU }, { alias: toCBU }]
    });

    if (!to) return res.status(404).json({ message: 'Cuenta destino no encontrada' });
    if (from._id.equals(to._id)) return res.status(400).json({ message: 'Cuenta destino inválida' });
    if (from.currency !== to.currency) return res.status(400).json({ message: 'Moneda incompatible' });
    if (from.balance < amount) return res.status(400).json({ message: 'Saldo insuficiente' });

    // Ajustar saldos
    from.balance -= amount;
    to.balance += Number(amount);

    await from.save();
    await to.save();

    // Registrar transacciones
    await Transaction.create({
      accountId: from._id,
      type: 'transfer_out',
      amount,
      currency,
      concept: concept || 'Transferencia a tercero',
      createdAt: new Date()
    });

    await Transaction.create({
      accountId: to._id,
      type: 'transfer_in',
      amount,
      currency,
      concept: concept || 'Transferencia recibida',
      createdAt: new Date()
    });

    // Registrar como Transfer
    await Transfer.create({
      fromAccountId: from._id,
      toAccountId: to._id,
      amount,
      currency,
      concept: concept || 'Transferencia a tercero',
      status: 'completed',
      initiatedAt: new Date(),
      executedAt: new Date()
    });

    res.status(200).json({ message: 'Transferencia realizada con éxito' });
  } catch (err) {
    console.error('Error en transferencia a terceros:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


module.exports = {
  getTransactionsByAccount,
  getRecentTransactions,
  getAccountById,
  transferOwnAccounts,
  transferToThirdParty
};
