'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // Number the questions of every set 1, 2, 3 ... in the order they were created.
    await db.query(`
      UPDATE questions q
      SET position = numbered.rn
      FROM (
        SELECT question_id,
               ROW_NUMBER() OVER (PARTITION BY set_id ORDER BY question_id) AS rn
        FROM questions
      ) numbered
      WHERE q.question_id = numbered.question_id
        AND q.position IS NULL
    `);

    // In the seed data, choice A is the right answer. Record it on the question.
    await db.query(`
      UPDATE questions q
      SET correct_choice_id = c.choice_id
      FROM choices c
      WHERE c.question_id = q.question_id
        AND c.choice_label = 'A'
        AND q.correct_choice_id IS NULL
    `);
  },

  async down() {
    // Nothing to undo: the demo questions are removed by their own seeder.
  },
};