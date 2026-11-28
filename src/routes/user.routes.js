'use strict';

const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const { roleRules, idParam, listRules } = require('../validators/user.validator');
const userController = require('../controllers/user.controller');

const router = Router();

router.use(requireUser('ADMIN'));

router.get('/', listRules, validate, userController.list);

router.patch(
  '/:id/role',
  idParam,
  roleRules,
  validate,
  userController.changeRole
);

module.exports = router;