'use strict';

const { Op } = require('sequelize');
const { QuestionSet, Question, Choice, GameSession } = require('../models');
const { toOffset } = require('../utils/paginate');

// One query loads the set, its questions and their choices (no N+1).
const WITH_QUESTIONS = [
  {
    model: Question,
    as: 'questions',
    include: [{ model: Choice, as: 'choices' }],
  },
];

const QUESTION_ORDER = [
  [{ model: Question, as: 'questions' }, 'position', 'ASC'],
  [{ model: Question, as: 'questions' }, { model: Choice, as: 'choices' }, 'choice_label', 'ASC'],
];

// hostId: only this host's sets. Leave it out to list every set (admins).
function findPage({ hostId, q, sort = 'set_id', order = 'asc', page, limit }) {
  const where = {};
  if (hostId) where.host_id = hostId;
  if (q) where.title = { [Op.iLike]: `%${q}%` };

  return QuestionSet.findAndCountAll({
    where,
    order: [[sort, order.toUpperCase()]],
    ...toOffset({ page, limit }),
  });
}

function findById(id, { withQuestions = false } = {}) {
  if (!withQuestions) return QuestionSet.findByPk(id);
  return QuestionSet.findByPk(id, { include: WITH_QUESTIONS, order: QUESTION_ORDER });
}

async function isUsedByGame(setId) {
  const games = await GameSession.count({ where: { set_id: setId } });
  return games > 0;
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = {
  findPage,
  findById,
  isUsedByGame,
  create,
  update,
  remove,
};