const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getUserAccounts,
  createAccount,
  closeAccount,
  getAccountTransactions
} = require('../controllers/accountController');
const  {getAccountById,} = require('../controllers/transactionController');

router.use(auth);

router.get('/', getUserAccounts);
router.post('/', createAccount);
router.patch('/:id/close', closeAccount);
router.get('/:id', getAccountById);
router.get('/:id/transactions', getAccountTransactions);
module.exports = router;
