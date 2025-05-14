const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso solo para administradores' });
    }
    next();
  };
  
  const isClient = (req, res, next) => {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Acceso solo para clientes' });
    }
    next();
  };
  
  module.exports = { isAdmin, isClient };
  