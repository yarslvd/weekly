const Model = require("./model");
const { users_calendars } = require("./initSequalize");

class UsersCalendars extends Model {
  constructor() {
    super(users_calendars);
  }

  async find(obj) {
    return await super.find(obj);
  }

  async save(obj) {
    return await super.save(obj);
  }

  async delete(obj) {
    return await super.delete(obj);
  }
}

module.exports = UsersCalendars;
