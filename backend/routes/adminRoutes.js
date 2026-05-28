const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Ensure only admins can access these routes
router.use(authMiddleware);
router.use((req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
});

// User management
router.get('/users', adminController.listUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Ads management
router.post('/ads', adminController.createAd);
router.get('/ads', adminController.listAds);
router.delete('/ads/:id', adminController.deleteAd);

// Notifications (admin can create notices)
router.post('/notifications', adminController.createNotification);
router.get('/notifications', adminController.listNotifications);

module.exports = router;
