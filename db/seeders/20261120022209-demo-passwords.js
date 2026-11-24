'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('DemoPass123', 10);

    await queryInterface.bulkUpdate(
      'users',
      { password_hash: hash },
      { password_hash: null }
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