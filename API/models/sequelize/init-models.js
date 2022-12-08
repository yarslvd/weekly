var DataTypes = require("sequelize").DataTypes;
var _calendars = require("./calendars");
var _events = require("./events");
var _events_calendars = require("./events_calendars");
var _users = require("./users");
var _users_calendars = require("./users_calendars");

function initModels(sequelize) {
  var calendars = _calendars(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var events_calendars = _events_calendars(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var users_calendars = _users_calendars(sequelize, DataTypes);

  events_calendars.belongsTo(calendars, {
    as: "calendar",
    foreignKey: "calendar_id",
  });
  calendars.hasMany(events_calendars, {
    as: "events_calendars",
    foreignKey: "calendar_id",
  });
  users.belongsTo(calendars, {
    as: "default_calendar",
    foreignKey: "default_calendar_id",
  });
  calendars.hasMany(users, { as: "users", foreignKey: "default_calendar_id" });
  users_calendars.belongsTo(calendars, {
    as: "calendar",
    foreignKey: "calendar_id",
  });
  calendars.hasMany(users_calendars, {
    as: "users_calendars",
    foreignKey: "calendar_id",
  });
  events_calendars.belongsTo(events, { as: "event", foreignKey: "event_id" });
  events.hasMany(events_calendars, {
    as: "events_calendars",
    foreignKey: "event_id",
  });
  calendars.belongsTo(users, { as: "author", foreignKey: "author_id" });
  users.hasMany(calendars, { as: "calendars", foreignKey: "author_id" });
  events.belongsTo(users, { as: "author", foreignKey: "author_id" });
  users.hasMany(events, { as: "events", foreignKey: "author_id" });
  users_calendars.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(users_calendars, {
    as: "users_calendars",
    foreignKey: "user_id",
  });

  return {
    calendars,
    events,
    events_calendars,
    users,
    users_calendars,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
