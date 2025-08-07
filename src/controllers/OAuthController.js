const fs = require('fs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET_JWT || 'fallbackSecret';
const JWT_EXPIRY = '360s'; // 1 minut

function getClients() {
  const data = fs.readFileSync('oauth.txt', 'utf8');
  return data.split('\n').map(line => line.trim()).filter(Boolean);
}

exports.generateToken = (req, res) => {
  const clientId = req.headers['client_id'];
  const clientSecret = req.headers['client_secret'];

  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: 'Missing client_id or client_secret' });
  }

  const clients = getClients();
  const isValid = clients.includes(`${clientId}:${clientSecret}`);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { client_id: clientId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  const payload = jwt.decode(token);
  const expiryTimestamp = payload.exp * 1000;

  const jwtEntry = `${token} | expires at: ${new Date(expiryTimestamp).toISOString()}\n`;
  fs.appendFileSync('jwt.txt', jwtEntry);

  res.json({ access_token: token, expires_in: 60 });
};
