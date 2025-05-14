require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");

const adminTransferRoutes = require("./routes/adminTransferRoutes");
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const transferRoutes = require('./routes/transactionRoutes')

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json());

// 🔌 Conexión a DB (si usás connectDB personalizado)
connectDB();

// 🔗 Rutas de API
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin/transfers", adminTransferRoutes);
app.use("/api/transfers", transferRoutes);

// 🚀 Inicialización del servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("🔴 MongoDB connection error:", err);
  });
