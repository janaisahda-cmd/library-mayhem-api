'use strict';

const { body, param } = require('express-validator');

const roleRules = [
  body('role')
    .isIn(['PLAYER', 'HOST', 'ADMIN'])
    .withMessage('Role must be PLAYER, HOST or ADMIN'),
];

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
];

module.exports = { roleRules, idParam };