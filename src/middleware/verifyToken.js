const jwt = require('jsonwebtoken');

const redis = require('../config/redis');
 
// eslint-disable-next-line no-undef
const JWT_SECRET = process.env.SECRET_JWT || 'fallbackSecret';
 
async function verifyToken(req, res, next) {

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    return res.status(401).json({ error: 'Missing or invalid Authorization header' });

  }
 
  const token = authHeader.split(' ')[1];
 
  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    const exists = await redis.get(token);

    if (!exists) {

      return res.status(401).json({ error: 'Token expired or invalidated' });

    }
 
    req.client = decoded.client_id;

    next();

  // eslint-disable-next-line no-unused-vars
  } catch (err) {

    return res.status(401).json({ error: 'Invalid or expired token' });

  }

}
 
module.exports = verifyToken;

 