'use strict';

const { body, param, query } = require('express-validator');
const { pageRules, sortRules } = require('./list.validator');

const ROLES = ['PLAYER', 'HOST', 'ADMIN'];

const roleRules = [
  body('role')
    .isIn(ROLES)
    .withMessage('Role must be PLAYER, HOST or ADMIN'),
];

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
];

// Only these columns may be sorted on. password_hash is not on the list.
const listRules = [
  ...pageRules,
  ...sortRules(['user_id', 'school_id', 'full_name', 'role']),
  query('role')
    .optional()
    .isIn(ROLES)
    .withMessage('role must be PLAYER, HOST or ADMIN'),
  query('q')
    .optional()
    .isString()
    .withMessage('q must be text')
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage('q must be at most 100 characters long'),
];

module.exports = { roleRules, idParam, listRules };