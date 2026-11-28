'use strict';

const { body, param, query } = require('express-validator');
const { pageRules, sortRules } = require('./list.validator');

const setIdParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id must be a positive whole number')
  .toInt();

const questionIdParam = param('questionId')
  .isInt({ min: 1 })
  .withMessage('questionId must be a positive whole number')
  .toInt();

const questionText = () =>
  body('question_text')
    .exists()
    .withMessage('question_text is required')
    .bail()
    .isString()
    .withMessage('question_text must be text')
    .bail()
    .trim()
    .isLength({ min: 3, max: 300 })
    .withMessage('question_text must be 3 to 300 characters long');

const timeLimit = () =>
  body('time_limit_seconds')
    .optional()
    .isInt({ min: 5, max: 120 })
    .withMessage('time_limit_seconds must be a whole number from 5 to 120')
    .toInt();

const idsRules = [setIdParam, questionIdParam];

const listRules = [
  setIdParam,
  ...pageRules,
  ...sortRules(['position', 'created_at']),
  query('q')
    .optional()
    .isString()
    .withMessage('q must be text')
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage('q must be at most 100 characters long'),
];

const createRules = [
  setIdParam,
  questionText(),
  timeLimit(),
  body('choices')
    .isArray({ min: 2, max: 4 })
    .withMessage('choices must be a list of 2 to 4 items'),
  body('choices.*.text')
    .exists()
    .withMessage('each choice needs a text')
    .bail()
    .isString()
    .withMessage('choice text must be text')
    .bail()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('choice text must be 1 to 200 characters long'),
  body('choices.*.is_correct')
    .optional()
    .isBoolean()
    .withMessage('is_correct must be true or false')
    .toBoolean(),
];

const updateRules = [
  setIdParam,
  questionIdParam,
  questionText().optional(),
  timeLimit(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.some((key) => ['question_text', 'time_limit_seconds'].includes(key))) {
      throw new Error('send at least one of: question_text, time_limit_seconds');
    }
    return true;
  }),
];

module.exports = {
  idsRules,
  listRules,
  createRules,
  updateRules,
};