'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('question_sets', 'picture', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('questions', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('questions', 'position');
    await queryInterface.removeColumn('question_sets', 'picture');
  },
};