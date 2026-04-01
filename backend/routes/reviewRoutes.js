const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createReview, getWorkerReviews } = require('../controllers/reviewController');

// All routes here will be protected by authMiddleware
router.use(authMiddleware);

// Routes
router.post('/', createReview);
router.get('/worker/:workerId', getWorkerReviews);

module.exports = router;
