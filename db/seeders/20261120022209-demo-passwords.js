'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('DemoPass123', 10);
    await queryInterface.sequelize.query(
      "UPDATE users SET password_hash = :hash WHERE password_hash IS NULL OR password_hash LIKE 'hashed_password_%'",
      { replacements: { hash } }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate(
      'users',
      { password_hash: null },
      {}
    );
  },
};