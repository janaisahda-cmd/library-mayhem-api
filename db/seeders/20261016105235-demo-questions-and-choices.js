'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    const [[set]] = await db.query(
      "SELECT set_id FROM question_sets WHERE title = 'Library Mayhem Basics'"
    );

    // Insert questions
    await queryInterface.bulkInsert('questions', [
      {
        set_id: set.set_id,
        question_text: 'What is the main purpose of a library catalog?',
        time_limit_seconds: 15,
        created_at: new Date(),
      },
      {
        set_id: set.set_id,
        question_text: 'Where should you return borrowed books?',
        time_limit_seconds: 15,
        created_at: new Date(),
      },
      {
        set_id: set.set_id,
        question_text: 'What does "OPAC" stand for?',
        time_limit_seconds: 15,
        created_at: new Date(),
      },
    ]);

    // Get the questions we just inserted
    const questions = await db.query(
      "SELECT question_id FROM questions WHERE set_id = :setId ORDER BY question_id",
      {
        replacements: { setId: set.set_id },
        type: db.QueryTypes.SELECT,
      }
    );

    // Insert choices for each question
    await queryInterface.bulkInsert('choices', [
      // Question 1
      { question_id: questions[0].question_id, choice_label: 'A', choice_text: 'To find books and resources' },
      { question_id: questions[0].question_id, choice_label: 'B', choice_text: 'To order food' },
      { question_id: questions[0].question_id, choice_label: 'C', choice_text: 'To play games' },
      { question_id: questions[0].question_id, choice_label: 'D', choice_text: 'To watch movies' },

      // Question 2
      { question_id: questions[1].question_id, choice_label: 'A', choice_text: 'At the circulation desk' },
      { question_id: questions[1].question_id, choice_label: 'B', choice_text: 'Anywhere on the floor' },
      { question_id: questions[1].question_id, choice_label: 'C', choice_text: 'In the trash' },
      { question_id: questions[1].question_id, choice_label: 'D', choice_text: 'At home' },

      // Question 3
      { question_id: questions[2].question_id, choice_label: 'A', choice_text: 'Online Public Access Catalog' },
      { question_id: questions[2].question_id, choice_label: 'B', choice_text: 'Official Public Art Collection' },
      { question_id: questions[2].question_id, choice_label: 'C', choice_text: 'Open Public Activity Center' },
      { question_id: questions[2].question_id, choice_label: 'D', choice_text: 'Online Private Access Code' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('choices', null, {});
    await queryInterface.bulkDelete('questions', null, {});
  },
};