'use strict';

const userService = require('../services/user.service');
const { matchedData } = require('express-validator');

async function list(req, res, next) {
  try {
    const users = await userService.list();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
}

async function changeRole(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const { role } = matchedData(req, { locations: ['body'] });
    const user = await userService.changeRole(req.user.user_id, id, role);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, changeRole };