const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users_calendars",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
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
      user_role: {
        type: DataTypes.ENUM("watcher", "assignee"),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users_calendars",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "user_id",
          using: "BTREE",
          fields: [{ name: "user_id" }],
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
