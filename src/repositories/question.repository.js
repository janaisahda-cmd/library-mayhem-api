'use strict';

const { Op } = require('sequelize');
const { sequelize, Question, Choice } = require('../models');
const { toOffset } = require('../utils/paginate');

const WITH_CHOICES = [{ model: Choice, as: 'choices' }];
const CHOICE_ORDER = [{ model: Choice, as: 'choices' }, 'choice_label', 'ASC'];

function findPage(setId, { q, sort = 'position', order = 'asc', page, limit }) {
  const where = { set_id: setId };
  if (q) where.question_text = { [Op.iLike]: `%${q}%` };

  return Question.findAndCountAll({
    where,
    include: WITH_CHOICES,
    distinct: true,
    order: [[sort, order.toUpperCase()], CHOICE_ORDER],
    ...toOffset({ page, limit }),
  });
}

function findOne(setId, questionId) {
  return Question.findOne({
    where: { question_id: questionId, set_id: setId },
    include: WITH_CHOICES,
    order: [CHOICE_ORDER],
  });
}

// A question and its choices are saved all together or not at all.
function createWithChoices(setId, fields, choices, correctIndex) {
  return sequelize.transaction(async (t) => {
    const last = await Question.max('position', { where: { set_id: setId }, transaction: t });
    const question = await Question.create(
      { ...fields, set_id: setId, position: (Number(last) || 0) + 1 },
      { transaction: t }
    );

    const saved = [];
    for (let i = 0; i < choices.length; i += 1) {
      const choice = await Choice.create(
        {
          question_id: question.question_id,
          choice_label: 'ABCD'[i],
          choice_text: choices[i].text,
        },
        { transaction: t }
      );
      saved.push(choice);
    }

    await question.update({ correct_choice_id: saved[correctIndex].choice_id }, { transaction: t });
    return question.question_id;
  });
}

function update(question, changes) {
  return question.update(changes);
}

// Delete a question and close the gap in the positions, so they stay 1, 2, 3 ...
function removeAndRenumber(question) {
  return sequelize.transaction(async (t) => {
    await question.destroy({ transaction: t });
    await sequelize.query(
      'UPDATE questions SET position = position - 1 WHERE set_id = :setId AND position > :position',
      {
        replacements: { setId: question.set_id, position: question.position },
        transaction: t,
      }
    );
  });
}

module.exports = {
  findPage,
  findOne,
  createWithChoices,
  update,
  removeAndRenumber,
};