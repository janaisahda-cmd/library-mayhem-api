'use strict';

const questionRepository = require('../repositories/question.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const questionSetService = require('./question-set.service');
const { badRequest, notFound, conflict } = require('../errors/app-error');

// The caller must own the set (403 otherwise).
async function ownedSet(setId, user) {
  return questionSetService.get(setId, user);
}

// A set that a game already uses is frozen: its questions can no longer change (409).
async function editableSet(setId, user) {
  const questionSet = await ownedSet(setId, user);
  if (await questionSetRepository.isUsedByGame(questionSet.set_id)) {
    throw conflict(
      'SET_IN_USE',
      'This question set is already used by a game, so its questions cannot change.'
    );
  }
  return questionSet;
}

async function findOrFail(setId, questionId) {
  const question = await questionRepository.findOne(setId, questionId);
  if (!question) {
    throw notFound('QUESTION_NOT_FOUND', `Question set ${setId} has no question ${questionId}.`);
  }
  return question;
}

async function list(setId, query, user) {
  await ownedSet(setId, user);
  return questionRepository.findPage(setId, query);
}

async function get(setId, questionId, user) {
  await ownedSet(setId, user);
  return findOrFail(setId, questionId);
}

async function create(setId, data, user) {
  await editableSet(setId, user);

  // The rule: exactly one choice is marked correct.
  const correct = data.choices
    .map((choice, index) => (choice.is_correct === true ? index : -1))
    .filter((index) => index >= 0);
  if (correct.length !== 1) {
    throw badRequest(
      'ONE_CORRECT_CHOICE_REQUIRED',
      'Mark exactly one choice with "is_correct": true.'
    );
  }

  const questionId = await questionRepository.createWithChoices(
    setId,
    { question_text: data.question_text, time_limit_seconds: data.time_limit_seconds },
    data.choices,
    correct[0]
  );
  return findOrFail(setId, questionId);
}

async function update(setId, questionId, changes, user) {
  await editableSet(setId, user);
  const question = await findOrFail(setId, questionId);
  await questionRepository.update(question, changes);
  return findOrFail(setId, questionId);
}

async function remove(setId, questionId, user) {
  await editableSet(setId, user);
  const question = await findOrFail(setId, questionId);
  await questionRepository.removeAndRenumber(question);
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};