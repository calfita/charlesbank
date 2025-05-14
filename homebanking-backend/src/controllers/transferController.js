const Transfer = require("../models/Transfer");
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const mongoose = require("mongoose");

// Umbral para requerir aprobación (ej: 100.000 ARS)
const REQUIERE_APROBACION_UMBRAL = 100000;

const createTransfer = async (req, res) => {
  const { fromAccountId, toAccountId, amount, currency } = req.body;

  try {
    if (!fromAccountId || !toAccountId || !amount || !currency) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const fromAccount = await Account.findById(fromAccountId);
    const toAccount = await Account.findById(toAccountId);

    if (!fromAccount || !toAccount) {
      return res
        .status(404)
        .json({ message: "Cuenta origen o destino no encontrada" });
    }

    if (!fromAccount.userId.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "No sos titular de la cuenta origen" });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: "Saldo insuficiente" });
    }

    const requiereAprobacion = amount >= REQUIERE_APROBACION_UMBRAL;

    const transfer = await Transfer.create({
      fromAccountId: from._id,
      toAccountId: to._id,
      amount,
      currency,
      concept: concept || "Transferencia entre cuentas propias",
      status: "completed",
      initiatedAt: new Date(),
      executedAt: new Date(),
    });

    if (!requiereAprobacion) {
      // Restar y sumar saldos
      fromAccount.balance -= amount;
      toAccount.balance += amount;
      await Promise.all([fromAccount.save(), toAccount.save()]);

      // Crear transacciones
      await Transaction.create([
        {
          accountId: fromAccountId,
          type: "transfer_out",
          amount,
          currency,
          concept: "Transferencia enviada",
          relatedTransferId: transfer._id,
        },
        {
          accountId: toAccountId,
          type: "transfer_in",
          amount,
          currency,
          concept: "Transferencia recibida",
          relatedTransferId: transfer._id,
        },
      ]);
    }

    res
      .status(201)
      .json({
        message: requiereAprobacion
          ? "Transferencia pendiente de aprobación"
          : "Transferencia completada",
        transfer,
      });
  } catch (err) {
    console.error("Error al crear transferencia:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  createTransfer,
};
