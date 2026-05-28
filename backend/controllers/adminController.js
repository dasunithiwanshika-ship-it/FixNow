const User = require('../models/User');
const Ad = require('../models/Ad');
const Notification = require('../models/Notification');

// Helper to emit socket events if io is available
const emitNotification = (notif) => {
  if (global.io) {
    global.io.emit('notification', notif);
  }
};

module.exports = {
  // ---------- User Management ----------
  listUsers: async (req, res) => {
    try {
      const users = await User.find({ isActive: { $ne: false } }).select('-password');
      res.json(users);
    } catch (err) {
      console.error('listUsers error:', err);
      res.status(500).json({ message: 'Server error fetching users' });
    }
  },

  updateUserRole: async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !['Customer', 'Worker', 'Admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role supplied' });
    }
    try {
      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error('updateUserRole error:', err);
      res.status(500).json({ message: 'Server error updating role' });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User soft‑deleted', user });
    } catch (err) {
      console.error('deleteUser error:', err);
      res.status(500).json({ message: 'Server error deleting user' });
    }
  },

  // ---------- Ad Management ----------
  createAd: async (req, res) => {
    const { title, imageUrl, link, startDate, endDate, targetRole } = req.body;
    try {
      const ad = await Ad.create({
        title,
        imageUrl,
        link,
        startDate,
        endDate,
        targetRole,
        createdBy: req.user.id,
      });
      res.status(201).json(ad);
    } catch (err) {
      console.error('createAd error:', err);
      res.status(500).json({ message: 'Server error creating ad' });
    }
  },

  listAds: async (req, res) => {
    try {
      const ads = await Ad.find({ isActive: true }).populate('createdBy', 'name email');
      res.json(ads);
    } catch (err) {
      console.error('listAds error:', err);
      res.status(500).json({ message: 'Server error fetching ads' });
    }
  },

  deleteAd: async (req, res) => {
    const { id } = req.params;
    try {
      const ad = await Ad.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!ad) return res.status(404).json({ message: 'Ad not found' });
      res.json({ message: 'Ad soft‑deleted', ad });
    } catch (err) {
      console.error('deleteAd error:', err);
      res.status(500).json({ message: 'Server error deleting ad' });
    }
  },

  // ---------- Notification Management ----------
  createNotification: async (req, res) => {
    const { userId, type, title, body } = req.body;
    if (!userId || !type || !title || !body) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
      const notif = await Notification.create({
        user: userId,
        type,
        title,
        body,
        isRead: false,
      });
      // Emit to all connected clients
      emitNotification(notif);
      res.status(201).json(notif);
    } catch (err) {
      console.error('createNotification error:', err);
      res.status(500).json({ message: 'Server error creating notification' });
    }
  },

  listNotifications: async (req, res) => {
    try {
      const notifs = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.json(notifs);
    } catch (err) {
      console.error('listNotifications error:', err);
      res.status(500).json({ message: 'Server error fetching notifications' });
    }
  },
};
