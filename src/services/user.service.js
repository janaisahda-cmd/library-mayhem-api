'use strict';

const userRepo = require('../repositories/user.repository');
const { AppError } = require('../errors/app-error');

async function list() {
  return userRepo.findAll();
}

async function changeRole(actorId, targetId, newRole) {
  if (Number(actorId) === Number(targetId)) {
    throw new AppError(409, 'CONFLICT', 'You cannot change your own role');
  }

  const user = await userRepo.findById(targetId);
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  await userRepo.update(user, { role: newRole });
  return user;
}

module.exports = { list, changeRole };