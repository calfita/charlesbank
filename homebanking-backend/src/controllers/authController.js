const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Credential = require("../models/Credential");
const Account = require('../models/Account')
const generateAlias = (fullName) => {
  return (
    fullName.toLowerCase().replace(/\s+/g, "") +
    "." +
    Math.floor(Math.random() * 10000)
  );
};

const generateCBU = () => {
  return Math.floor(Math.random() * 1e16)
    .toString()
    .padStart(22, "0");
};
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar credencial por nombre de usuario (que es el email en tu sistema)
    const credential = await Credential.findOne({ username: email });

    if (!credential) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Buscar usuario asociado
    const user = await User.findById(credential.userId);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña hasheada
    const isValid = await bcrypt.compare(password, credential.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { role: user.role } });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const register = async (req, res) => {
  const { fullName, email, password, dni } = req.body;

  try {
    // Verificar email ya registrado (en credenciales)
    const existingCred = await Credential.findOne({ username: email });
    if (existingCred) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Verificar DNI ya registrado
    const existingDNI = await User.findOne({ dni });
    if (existingDNI) {
      return res.status(400).json({ message: 'El DNI ya está registrado' });
    }

    // Crear usuario
    const newUser = await User.create({
      fullName,
      email,
      dni,
      role: 'client'
    });

    // Crear cuenta por defecto
    const newAccount = await Account.create({
      userId: newUser._id,
      type: 'savings',
      alias: generateAlias(fullName),
      cbu: generateCBU(),
      balance: 0,
      currency: 'ARS'
    });

    // Crear credencial
    const passwordHash = await bcrypt.hash(password, 10);
    await Credential.create({
      userId: newUser._id,
      username: email,
      passwordHash
    });

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.address !== undefined) updates.address = req.body.address;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-__v');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};


module.exports = {
  login,
  register,
  getProfile,
  updateProfile
};
