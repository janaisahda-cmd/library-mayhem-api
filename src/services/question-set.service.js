'use strict';

const fs = require('fs/promises');
const path = require('path');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

const PROJECT_ROOT = path.join(__dirname, '..', '..');

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

// Deletes an uploaded picture. A file that is already gone is not an error.
async function removeFile(publicPath) {
  if (!publicPath) return;
  try {
    await fs.unlink(path.join(PROJECT_ROOT, publicPath));
  } catch (error) {
    // nothing to delete
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

// The upload middleware already saved the file. If we refuse the request,
// we delete that file again, so refused uploads leave nothing behind.
async function setCover(id, file, user) {
  const publicPath = `/uploads/covers/${file.filename}`;
  try {
    const questionSet = await findOrFail(id);
    assertOwner(questionSet, user);
    const oldPicture = questionSet.picture;
    const updated = await questionSetRepository.update(questionSet, { picture: publicPath });
    await removeFile(oldPicture);
    return updated;
  } catch (error) {
    await removeFile(publicPath);
    throw error;
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  setCover,
};