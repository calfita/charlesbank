const Transfer = require('../models/Transfer');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

const getPendingTransfers = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Solo admins' });

  const transfers = await Transfer.find({ status: 'pending' }).populate('fromAccountId toAccountId');
  res.json(transfers);
};

const approveTransfer = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Solo admins' });

  const transfer = await Transfer.findById(req.params.id);
  if (!transfer || transfer.status !== 'pending') return res.status(404).json({ message: 'Transferencia no encontrada o ya procesada' });

  const from = await Account.findById(transfer.fromAccountId);
  const to = await Account.findById(transfer.toAccountId);

  if (from.balance < transfer.amount) return res.status(400).json({ message: 'Saldo insuficiente en la cuenta origen' });

  // Ejecutar
  from.balance -= transfer.amount;
  to.balance += transfer.amount;
  await Promise.all([from.save(), to.save()]);

  // Transacciones
  await Transaction.create([
    {
      accountId: from._id,
      type: 'transfer_out',
      amount: transfer.amount,
      currency: transfer.currency,
      concept: 'Transferencia aprobada',
      relatedTransferId: transfer._id
    },
    {
      accountId: to._id,
      type: 'transfer_in',
      amount: transfer.amount,
      currency: transfer.currency,
      concept: 'Transferencia recibida',
      relatedTransferId: transfer._id
    }
  ]);

  // Marcar como aprobada
  transfer.status = 'completed';
  transfer.approvedBy = req.user._id;
  transfer.approvedAt = new Date();
  transfer.executedAt = new Date();
  await transfer.save();

  res.json({ message: 'Transferencia aprobada y ejecutada' });
};

const rejectTransfer = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Solo admins' });

  const transfer = await Transfer.findById(req.params.id);
  if (!transfer || transfer.status !== 'pending') return res.status(404).json({ message: 'Transferencia no encontrada o ya procesada' });

  transfer.status = 'rejected';
  transfer.approvedBy = req.user._id;
  transfer.approvedAt = new Date();
  await transfer.save();

  res.json({ message: 'Transferencia rechazada' });
};

module.exports = {
  getPendingTransfers,
  approveTransfer,
  rejectTransfer
};
