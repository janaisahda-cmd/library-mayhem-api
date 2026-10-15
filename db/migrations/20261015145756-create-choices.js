'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('choices', {
      choice_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onDelete: 'CASCADE',
      },
      choice_label: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      choice_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('choices', {
      type: 'unique',
      name: 'uq_question_choice_label',
      fields: ['question_id', 'choice_label'],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('choices');
  },
};