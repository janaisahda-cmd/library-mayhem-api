'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    const [[host]] = await db.query(
      "SELECT user_id FROM users WHERE school_id = '2099-1001'"
    );

    await queryInterface.bulkInsert('question_sets', [
      {
        host_id: host.user_id,
        title: 'Library Mayhem Basics',
        description: 'Basic questions about the library for the game.',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('question_sets', null, {});
  },
};