const express = require('express');
const { register, verifyEmail } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail); 

module.exports = router;
