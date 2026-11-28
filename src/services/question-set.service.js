'use strict';

const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

async function findOrFail(id, options) {
  const questionSet = await questionSetRepository.findById(id, options);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  }
  return questionSet;
}

function isOwner(questionSet, user) {
  return questionSet.host_id === user.user_id || user.role === 'ADMIN';
}

function assertOwner(questionSet, user) {
  if (!isOwner(questionSet, user)) {
    throw forbidden('This question set belongs to another host.');
  }
}

async function list(user, query) {
  const hostId = user.role === 'ADMIN' ? null : user.user_id;
  return questionSetRepository.findPage({ ...query, hostId });
}

// include: 'questions' loads the questions and their choices too.
async function get(id, user, include) {
  const questionSet = await findOrFail(id, { withQuestions: include === 'questions' });
  assertOwner(questionSet, user);
  return questionSet;
}

async function create(data, user) {
  return questionSetRepository.create({
    ...data,
    host_id: user.user_id,
  });
}

async function update(id, changes, user) {
  const questionSet = await findOrFail(id);
  assertOwner(questionSet, user);
  return questionSetRepository.update(questionSet, changes);
}

async function remove(id, user) {
  const questionSet = await findOrFail(id);
  assertOwner(questionSet, user);
  await questionSetRepository.remove(questionSet);
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};