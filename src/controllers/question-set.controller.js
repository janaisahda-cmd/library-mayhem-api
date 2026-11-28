'use strict';

const { matchedData } = require('express-validator');
const questionSetService = require('../services/question-set.service');
const { toJson: questionToJson } = require('./question.controller');
const { envelope } = require('../utils/paginate');

function toJson(questionSet) {
  const json = {
    id: questionSet.set_id,
    title: questionSet.title,
    description: questionSet.description,
    picture: questionSet.picture,
    host_id: questionSet.host_id,
    created_at: questionSet.created_at,
  };
  if (questionSet.questions) {
    json.questions = questionSet.questions.map(questionToJson);
  }
  return json;
}

async function list(req, res) {
  const query = matchedData(req, { locations: ['query'] });
  const { rows, count } = await questionSetService.list(req.user, query);
  res.status(200).json(envelope(rows.map(toJson), count, query));
}

async function get(req, res) {
  const { id, include } = matchedData(req, { locations: ['params', 'query'] });
  const questionSet = await questionSetService.get(id, req.user, include);
  res.status(200).json(toJson(questionSet));
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const questionSet = await questionSetService.create(data, req.user);
  res.status(201).json(toJson(questionSet));
}

async function update(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const changes = matchedData(req, { locations: ['body'] });
  const questionSet = await questionSetService.update(id, changes, req.user);
  res.status(200).json(toJson(questionSet));
}

async function remove(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  await questionSetService.remove(id, req.user);
  res.status(204).end();
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};