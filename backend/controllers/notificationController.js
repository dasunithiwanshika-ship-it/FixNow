const Notification = require('../models/Notification');

// Get notifications for logged-in user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Admin creates a notification for a specific user or all users
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    const targetUser = userId || undefined; // if undefined, we'll handle later (e.g., broadcast)
    // For simplicity, if no userId, create for all users (admin broadcast)
    if (!userId) {
      // Get all user ids
      const User = require('../models/User');
      const users = await User.find({}, '_id');
      const notifications = users.map(u => ({ user: u._id, title, body: message, type }));
      await Notification.insertMany(notifications);
      return res.status(201).json({ message: 'Broadcast notification sent' });
    }
    const notif = new Notification({ user: targetUser, title, body: message, type });
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Not found' });
    // Ensure the owner is the requester
    if (notif.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    notif.isRead = true;
    await notif.save();
    res.json(notif);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Delete a notification (admin or owner)
exports.deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'Admin' && notif.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await notif.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
