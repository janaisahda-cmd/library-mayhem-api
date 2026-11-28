'use strict';

const { body, param, query } = require('express-validator');
const { pageRules, sortRules } = require('./list.validator');

const idParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id must be a positive whole number')
  .toInt();

const title = () =>
  body('title')
    .exists()
    .withMessage('title is required')
    .bail()
    .isString()
    .withMessage('title must be text')
    .bail()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('title must be 3 to 100 characters long');

const description = () =>
  body('description')
    .optional({ values: 'null' })
    .isString()
    .withMessage('description must be text')
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage('description must be at most 500 characters long');

const search = () =>
  query('q')
    .optional()
    .isString()
    .withMessage('q must be text')
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage('q must be at most 100 characters long');

const createRules = [title(), description()];

const listRules = [
  ...pageRules,
  ...sortRules(['set_id', 'title', 'created_at']),
  search(),
];

const getRules = [
  idParam,
  query('include')
    .optional()
    .isIn(['questions'])
    .withMessage('include must be: questions'),
];

const updateRules = [
  idParam,
  title().optional(),
  description(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.some((key) => ['title', 'description'].includes(key))) {
      throw new Error('send at least one of: title, description');
    }
    return true;
  }),
];

module.exports = {
  idParam,
  createRules,
  listRules,
  getRules,
  updateRules,
};