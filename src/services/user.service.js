'use strict';

const userRepo = require('../repositories/user.repository');
const { AppError } = require('../errors/app-error');

async function list() {
  return userRepo.findAll();
}

async function changeRole(actorId, targetId, newRole) {
  if (Number(actorId) === Number(targetId)) {
    throw new AppError(409, 'You cannot change your own role', 'CONFLICT');
  }

  const user = await userRepo.findById(targetId);
  if (!user) {
    throw new AppError(404, 'User not found', 'NOT_FOUND');
  }

  await userRepo.update(user, { role: newRole });
  return user;
}

module.exports = { list, changeRole };