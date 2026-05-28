const roleMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user in request' });
    }
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    // user is admin, proceed
    next();
  } catch (err) {
    console.error('Error in roleMiddleware:', err);
    res.status(500).json({ message: 'Server error in role middleware' });
  }
};

module.exports = roleMiddleware;
