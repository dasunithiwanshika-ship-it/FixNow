const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { updateProfile, getDashboardStats } = require('../controllers/userController');

// All profile/dashboard routes are protected
router.use(authMiddleware);

router.put('/profile', updateProfile);
router.get('/dashboard', getDashboardStats);

module.exports = router;
