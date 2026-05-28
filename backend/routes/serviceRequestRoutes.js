const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createServiceRequest,
    getAllServiceRequests,
    getUserServiceRequests,
    getServiceRequestById,
    updateServiceRequestStatus,
    uploadProgressImage,
    suggestBudget
} = require('../controllers/serviceRequestController');

// All routes here will be protected by authMiddleware
router.use(authMiddleware);

// Routes
router.post('/', createServiceRequest);
router.get('/', getAllServiceRequests);
router.get('/my-requests', getUserServiceRequests);
router.get('/suggest-budget', suggestBudget);
router.get('/:id', getServiceRequestById);
router.put('/:id/status', updateServiceRequestStatus);
router.put('/:id/progress-image', uploadProgressImage);

module.exports = router;
