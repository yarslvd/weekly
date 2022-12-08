const Model = require("./model");
const {
  calendars,
  users,
  users_calendars,
  events,
  events_calendars,
} = require("./initSequalize");
const { Op } = require("sequelize");

class Calendars extends Model {
  constructor() {
    super(calendars);
  }

  async find(props) {
    if (!props) {
      return await this.table.findAll({
        raw: true,
        include: [
          {
            model: users,
            attributes: ["id", "login", "full_name", "profile_picture"],
            as: "author",
            required: true,
          },
        ],
      });
    }
    if (props.id) {
      return await this.table.findOne({
        where: { id: props.id },
        include: [
          {
            model: users,
            attributes: ["id", "login", "full_name", "profile_picture"],
            as: "author",
            required: true,
          },
        ],
      });
    }
    let select = await this.table.findAll({
      where: props,
      raw: true,
      include: [
        {
          model: users,
          attributes: ["id", "login", "full_name", "profile_picture"],
          as: "author",
          required: true,
        },
      ],
    });
    return select.length == 1 ? select[0] : select;
  }

  async save(obj) {
    return await super.save(obj);
  }

  async delete(obj) {
    return await super.delete(obj);
  }

  async getCalendarMembers(calendarId) {
    return await users.findAll({
      attributes: [
        "id",
        "login",
        "full_name",
        "profile_picture",
        "users_calendars.user_role",
      ],
      raw: true,
      include: {
        model: users_calendars,
        as: "users_calendars",
        where: { calendar_id: calendarId },
        attributes: [],
        raw: true,
      },
    });
  }

  async getCalendarEvents(calendarId, date, limit) {
    if (date) {
      const start = new Date(date);
      const end = new Date(start.getTime() + 86400000);
      return await events.findAll({
        attributes: { exclude: ["author_id"] },
        where: {
          start_at: {
            [Op.between]: [start.toISOString(), end.toISOString()],
          },
        },
        include: [
          {
            model: users,
            attributes: ["id", "login", "full_name", "profile_picture"],
            as: "author",
            required: true,
          },
          {
            model: events_calendars,
            as: "events_calendars",
            where: { calendar_id: calendarId },
            attributes: [],
            raw: true,
          },
        ],
        ...(limit ? { limit: parseInt(limit) } : {}),
      });
    }
    return await events.findAll({
      attributes: { exclude: ["author_id"] },
      include: [
        {
          model: users,
          attributes: ["id", "login", "full_name", "profile_picture"],
          as: "author",
          required: true,
        },
        {
          model: events_calendars,
          as: "events_calendars",
          where: { calendar_id: calendarId },
          attributes: [],
          raw: true,
        },
      ],
      ...(limit ? { limit: parseInt(limit) } : {}),
    });
  }
}

module.exports = Calendars;
