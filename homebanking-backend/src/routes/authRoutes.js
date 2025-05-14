const router = require('express').Router();
const { login, register, getProfile, updateProfile } = require('../controllers/authController');

const auth = require ('../middlewares/authMiddleware')

router.post('/login', login);
router.post('/register', register);
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);


module.exports = router;