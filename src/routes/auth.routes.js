'use strict';

const { Router } = require('express');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');
const currentUser = require('../middlewares/current-user');
const authValidator = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post(
  '/register',
  authValidator.register,
  validate,
  authController.register
);

router.post(
  '/login',
  authValidator.login,
  validate,
  authController.login
);

router.get(
  '/me',
  currentUser,
  requireUser(),
  authController.me
);

module.exports = router;