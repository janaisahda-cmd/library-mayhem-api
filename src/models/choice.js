'use strict';

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Choice',
    {
      choice_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      choice_label: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      choice_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'choices',
      timestamps: false,
    }
  );