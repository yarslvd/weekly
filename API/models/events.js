const Model = require("./model");
const { events } = require("./initSequalize");

class Events extends Model {
  constructor() {
    super(events);
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

module.exports = Events;
