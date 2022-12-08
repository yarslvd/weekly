const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "events_calendars",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
      },
      calendar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "calendars",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "events_calendars",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "event_id",
          using: "BTREE",
          fields: [{ name: "event_id" }],
        },
        {
          name: "calendar_id",
          using: "BTREE",
          fields: [{ name: "calendar_id" }],
        },
      ],
    }
  );
};
