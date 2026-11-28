'use strict';

const { matchedData } = require('express-validator');
const questionService = require('../services/question.service');
const { envelope } = require('../utils/paginate');

function choiceToJson(choice, correctChoiceId) {
  return {
    id: choice.choice_id,
    label: choice.choice_label,
    text: choice.choice_text,
    is_correct: choice.choice_id === correctChoiceId,
  };
}

function toJson(question) {
  return {
    id: question.question_id,
    position: question.position,
    question_text: question.question_text,
    time_limit_seconds: question.time_limit_seconds,
    choices: (question.choices || []).map((choice) =>
      choiceToJson(choice, question.correct_choice_id)
    ),
  };
}

async function list(req, res) {
  const { id, ...query } = matchedData(req, { locations: ['params', 'query'] });
  const { rows, count } = await questionService.list(id, query, req.user);
  res.status(200).json(envelope(rows.map(toJson), count, query));
}

async function get(req, res) {
  const { id, questionId } = matchedData(req, { locations: ['params'] });
  const question = await questionService.get(id, questionId, req.user);
  res.status(200).json(toJson(question));
}

async function create(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const data = matchedData(req, { locations: ['body'] });
  const question = await questionService.create(id, data, req.user);
  res.status(201).json(toJson(question));
}

async function update(req, res) {
  const { id, questionId } = matchedData(req, { locations: ['params'] });
  const changes = matchedData(req, { locations: ['body'] });
  const question = await questionService.update(id, questionId, changes, req.user);
  res.status(200).json(toJson(question));
}

async function remove(req, res) {
  const { id, questionId } = matchedData(req, { locations: ['params'] });
  await questionService.remove(id, questionId, req.user);
  res.status(204).end();
}

module.exports = {
  toJson,
  list,
  get,
  create,
  update,
  remove,
};