const jwt = require('jsonwebtoken');
 
const JWT_SECRET = process.env.SECRET_JWT || 'fallbackSecret';
 
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
 
  const token = authHeader.split(' ')[1];
 
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.client = decoded.client_id; // atașăm clientul la request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
 
module.exports = verifyToken;