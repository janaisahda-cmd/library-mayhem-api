'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');
    if (!table.password_hash) {
      await queryInterface.addColumn('users', 'password_hash', {
        type: Sequelize.STRING(60),
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('users');
    if (table.password_hash) {
      await queryInterface.removeColumn('users', 'password_hash');
    }
  },
};