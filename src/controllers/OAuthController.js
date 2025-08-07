// const fs = require('fs');
// const jwt = require('jsonwebtoken');
// const OauthClient = require('../models/OauthClient.js');
 
// // eslint-disable-next-line no-undef
// const JWT_SECRET = process.env.SECRET_JWT || 'fallbackSecret';
// const JWT_EXPIRY = '360s';
 
// exports.generateToken = async (req, res) => {
//   try {
//     const clientId = req.headers['client_id'];
//     const clientSecret = req.headers['client_secret'];
 
//     if (!clientId || !clientSecret) {
//       return res.status(400).json({ error: 'Missing client_id or client_secret' });
//     }
 
//     const client = await OauthClient.findOne({
//       client_id: clientId,
//       client_secret: clientSecret
//     });
 
//     if (!client) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { client_id: clientId },
//       JWT_SECRET,
//       { expiresIn: JWT_EXPIRY }
//     );
 
//     const payload = jwt.decode(token);
//     const expiryTimestamp = payload.exp * 1000;
 
//     const jwtEntry = `${token} | expires at: ${new Date(expiryTimestamp).toISOString()}\n`;
//     fs.appendFileSync('jwt.txt', jwtEntry);
 
//     res.json({
//       access_token: token,
//       expires_in: 60
//     });
 
//   } catch (err) {
//     console.error('Token generation error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

const jwt = require('jsonwebtoken');

const OauthClient = require('../models/OauthClient');

const redis = require('../config/redis');
 
// eslint-disable-next-line no-undef
const JWT_SECRET = process.env.SECRET_JWT || 'fallbackSecret';

const JWT_EXPIRY_SECONDS = 60;
 
exports.generateToken = async (req, res) => {

  try {

    const clientId = req.headers['client_id'];

    const clientSecret = req.headers['client_secret'];
 
    if (!clientId || !clientSecret) {

      return res.status(400).json({ error: 'Missing client_id or client_secret' });

    }
 
    const client = await OauthClient.findOne({ client_id: clientId, client_secret: clientSecret });

    if (!client) {

      return res.status(401).json({ error: 'Invalid credentials' });

    }
 
    const token = jwt.sign({ client_id: clientId }, JWT_SECRET, {

      expiresIn: JWT_EXPIRY_SECONDS

    });
 

    await redis.set(token, 'valid', {

      EX: JWT_EXPIRY_SECONDS

    });
 
    res.json({ access_token: token, expires_in: JWT_EXPIRY_SECONDS });
 
  } catch (err) {

    console.error('Token generation error:', err);

    res.status(500).json({ error: 'Internal server error' });

  }

};

 