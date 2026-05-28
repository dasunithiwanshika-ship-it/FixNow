const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createPaymentIntent } = require('../controllers/paymentController');

// All routes here will be protected by authMiddleware
router.use(authMiddleware);

// @route   POST /api/payments/create-intent
router.post('/create-intent', createPaymentIntent);

module.exports = router;
