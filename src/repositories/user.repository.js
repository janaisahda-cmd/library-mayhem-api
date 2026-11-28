'use strict';

const { Op } = require('sequelize');
const { User } = require('../models');
const { toOffset } = require('../utils/paginate');

function findBySchoolId(schoolId) {
  return User.findOne({ where: { school_id: schoolId } });
}

function findForLogin(schoolId) {
  return User.scope('withPassword').findOne({ where: { school_id: schoolId } });
}

function findById(userId) {
  return User.findByPk(userId);
}

function findAll() {
  return User.findAll({ order: [['user_id', 'ASC']] });
}

// One page of accounts, filtered by role and searched by school ID or name.
function findPage({ role, q, sort = 'user_id', order = 'asc', page, limit }) {
  const where = {};
  if (role) where.role = role;
  if (q) {
    where[Op.or] = [
      { school_id: { [Op.iLike]: `%${q}%` } },
      { full_name: { [Op.iLike]: `%${q}%` } },
    ];
  }

  return User.findAndCountAll({
    where,
    order: [[sort, order.toUpperCase()], ['user_id', 'ASC']],
    ...toOffset({ page, limit }),
  });
}

function create(data) {
  return User.create(data);
}

function update(user, changes) {
  return user.update(changes);
}

module.exports = {
  findBySchoolId,
  findForLogin,
  findById,
  findAll,
  findPage,
  create,
  update,
};