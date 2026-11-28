'use strict';

const { Router } = require('express');
const controller = require('../controllers/question.controller');
const rules = require('../validators/question.validator');
const validate = require('../middlewares/validate');

// mergeParams lets these routes see :id from /question-sets/:id/questions
const router = Router({ mergeParams: true });

router.get('/', rules.listRules, validate, controller.list);
router.post('/', rules.createRules, validate, controller.create);
router.get('/:questionId', rules.idsRules, validate, controller.get);
router.patch('/:questionId', rules.updateRules, validate, controller.update);
router.delete('/:questionId', rules.idsRules, validate, controller.remove);

module.exports = router;