'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // Get players from the finished game
    const players = await db.query(
      `SELECT p.player_id, p.nickname 
       FROM players p
       JOIN game_sessions s ON s.session_id = p.session_id
       WHERE s.session_code = '418263'
       ORDER BY p.player_id`,
      { type: db.QueryTypes.SELECT }
    );

    // Get questions
    const questions = await db.query(
      "SELECT question_id FROM questions ORDER BY question_id",
      { type: db.QueryTypes.SELECT }
    );

    // Get some choices
    const choices = await db.query(
      "SELECT choice_id, question_id FROM choices ORDER BY choice_id",
      { type: db.QueryTypes.SELECT }
    );

    // Insert answers for the 3 completed players (Ben, Cara, Dan)
    // Ella has no answers (not completed)
    const answers = [];

    for (let i = 0; i < 3; i++) { // first 3 players
      for (let q = 0; q < questions.length; q++) {
        const choice = choices.find(c => c.question_id === questions[q].question_id);
        answers.push({
          player_id: players[i].player_id,
          question_id: questions[q].question_id,
          submitted_choice_id: choice ? choice.choice_id : null,
          is_correct: true,
          response_time_sec: 8.5,
          stars_earned: 3,
          answered_at: new Date('2026-10-09T01:05:00Z'),
        });
      }
    }

    await queryInterface.bulkInsert('answers', answers);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('answers', null, {});
  },
};