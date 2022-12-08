const Model = require("./model");
const { events_calendars } = require("./initSequalize");

class EventsCalendars extends Model {
  constructor() {
    super(events_calendars);
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

module.exports = EventsCalendars;
