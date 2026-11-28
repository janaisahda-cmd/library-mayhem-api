'use strict';

const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No session has the code ${code}.`);
  }
  return session;
}

async function create(questionSetId, user) {
  const questionSet = await questionSetRepository.findById(questionSetId);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${questionSetId}.`);
  }
  if (questionSet.host_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This question set belongs to another host.');
  }

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      return await sessionRepository.create({
        set_id: questionSet.set_id,
        host_id: user.user_id,
        session_code: randomCode(),
        status: 'LOBBY',
      });
    } catch (error) {
      if (constraintOf(error) !== 'game_sessions_session_code_key') throw error;
    }
  }
  throw new Error('Could not find a free join code after 5 attempts.');
}

async function get(code) {
  return findOrFail(code);
}

async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (session.host_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This game belongs to another host.');
  }

  const NEXT = {
    LOBBY: ['ACTIVE', 'CLOSED'],
    ACTIVE: ['CLOSED'],
    CLOSED: [],
  };

  if (!NEXT[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} game cannot become ${status}.`);
  }

  const changes = { status };
  if (status === 'ACTIVE') changes.started_at = new Date();
  if (status === 'CLOSED') changes.ended_at = new Date();

  return sessionRepository.update(session, changes);
}

module.exports = {
  create,
  get,
  changeStatus,
  findOrFail,
};