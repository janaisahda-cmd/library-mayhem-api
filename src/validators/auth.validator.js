'use strict';

const { body } = require('express-validator');

const register = [
  body('school_id')
    .trim()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage('school_id must look like 2099-1001'),
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('full_name must be 2 to 80 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('email must be valid'),
  body('password')
    .isLength({ min: 8, max: 72 })
    .withMessage('password must be 8 to 72 characters')
    .matches(/[A-Za-z]/)
    .withMessage('password must contain a letter')
    .matches(/[0-9]/)
    .withMessage('password must contain a number'),
];

const login = [
  body('school_id')
    .trim()
    .notEmpty()
    .withMessage('school_id is required'),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
];

const roleRules = [
  body('role')
    .isIn(['PLAYER', 'HOST', 'ADMIN'])
    .withMessage('role must be PLAYER, HOST, or ADMIN'),
];

module.exports = {
  register,
  login,
  roleRules,
};