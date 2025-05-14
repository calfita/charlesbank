const express = require('express');
const router = express.Router();
const { getPendingTransfers, approveTransfer, rejectTransfer } = require('../controllers/adminTransferController');
const auth = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

router.use(auth);        // Verifica JWT
router.use(isAdmin);     // Verifica que sea admin

router.get('/pending', getPendingTransfers);
router.patch('/:id/approve', approveTransfer);
router.patch('/:id/reject', rejectTransfer);

module.exports = router;
