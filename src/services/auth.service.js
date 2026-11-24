'use strict';

const password = require('../security/password');
const token = require('../security/token');
const userRepo = require('../repositories/user.repository');
const { AppError } = require('../errors/app-error');

function toJson(user) {
  if (!user) return null;
  const json = user.toJSON ? user.toJSON() : { ...user };
  delete json.password_hash;
  return json;
}

async function register({ school_id, full_name, email, password: plain }) {
  const password_hash = await password.hash(plain);

  try {
    const user = await userRepo.create({
  school_id,
  username: school_id,
  full_name,
  email,
  password_hash,
  role: 'PLAYER',
});
    return toJson(user);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new AppError(409, 'School ID or email already taken', 'ALREADY_EXISTS');
    }
    throw err;
  }
}

async function login({ school_id, password: plain }) {
  const user = await userRepo.findForLogin(school_id);

  const ok = await password.matches(plain, user ? user.password_hash : null);
  if (!ok) {
    throw new AppError(401, 'Invalid school ID or password', 'INVALID_CREDENTIALS');
  }

  const signed = token.sign({
    user_id: user.user_id,
    role: user.role,
    school_id: user.school_id,
  });

  return {
    token: signed.token,
    token_type: 'Bearer',
    expires_in: signed.expires_in,
    user: toJson(user),
  };
}

async function me(userId) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError(401, 'Not authenticated', 'UNAUTHORIZED');
  }
  return toJson(user);
}

module.exports = {
  register,
  login,
  me,
  toJson,
};