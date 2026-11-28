// Login tokens: JSON Web Tokens signed with HS256 and JWT_SECRET.
// The payload says WHO (sub) and WHAT ROLE. It is signed, not encrypted:
// anyone can read it, nobody can change it without the secret.
'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

function sign(payload) {
  const expiresIn = env.JWT_EXPIRES_IN || env.jwtExpiresIn || '1h';
  const secret = env.JWT_SECRET || env.jwtSecret;

  if (!secret) {
    throw new Error('JWT_SECRET is missing in .env');
  }

  const token = jwt.sign(payload, secret, { expiresIn });
  return {
    token,
    expires_in: expiresIn,
  };
}

// Returns the payload, or throws when the token is forged, damaged or expired.
function verify(token) {
  const secret = env.JWT_SECRET || env.jwtSecret;
  return jwt.verify(token, secret);
}

module.exports = {
  sign,
  verify,
};