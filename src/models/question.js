'use strict';

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Question',
    {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      time_limit_seconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15,
      },
      correct_choice_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'questions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );