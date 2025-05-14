const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getTransactionsByAccount,
  getRecentTransactions,
  transferOwnAccounts,
  transferToThirdParty 
} = require('../controllers/transactionController');

router.use(auth);

router.get('/recent', getRecentTransactions);
router.get('/:accountId', getTransactionsByAccount);
router.post('/own', transferOwnAccounts);
router.post('/third', auth, transferToThirdParty);

module.exports = router;
