const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach user ID to the request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
