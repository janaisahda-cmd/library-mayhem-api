'use strict';

const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const data = matchedData(req);
    const user = await authService.register(data);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = matchedData(req);
    const result = await authService.login(data);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.me(req.user.user_id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  me,
};