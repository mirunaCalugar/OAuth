const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/OAuthController.js');

router.post('/token', generateToken);

module.exports = router;
