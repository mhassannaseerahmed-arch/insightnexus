const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const headerToken = req.header('x-auth-token');
  const authHeader = req.header('authorization') || req.header('Authorization');
  const bearerToken =
    authHeader && String(authHeader).startsWith('Bearer ')
      ? String(authHeader).slice('Bearer '.length).trim()
      : null;

  const token = bearerToken || headerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.clinicId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = auth;
