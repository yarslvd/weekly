const Sequelize = require("sequelize");
const initModels = require("./sequelize/init-models");
const { db } = require("../config.json");

const sequelize = new Sequelize(db.database, db.user, db.password, {
  dialect: db.dialect,
  host: db.host,
  define: {
    timestamps: false,
  },
});

module.exports = initModels(sequelize);
