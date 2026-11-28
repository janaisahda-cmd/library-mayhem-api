'use strict';

const userService = require('../services/user.service');
const { matchedData } = require('express-validator');
const { envelope } = require('../utils/paginate');

async function list(req, res, next) {
  try {
    const query = matchedData(req, { locations: ['query'] });
    const { rows, count } = await userService.list(query);
    res.json(envelope(rows, count, query));
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