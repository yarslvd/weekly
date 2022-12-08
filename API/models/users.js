const Model = require("./model");
const {
  users,
  calendars,
  users_calendars,
  events,
  events_calendars,
} = require("./initSequalize");
const { Op } = require("sequelize");
const calendarModel = new (require("./calendars"))();

class Users extends Model {
  constructor() {
    super(users);
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

  async getUsersCalendars(userProps) {
    if (!userProps) {
      return new Error("Criterion object is undefined");
    }
    let list = await calendars.findAll({
      attributes: { exclude: ["author_id"] },
      include: [
        {
          model: users,
          attributes: ["id", "login", "full_name", "profile_picture"],
          required: true,
          as: "author",
        },
        {
          model: users_calendars,
          where: userProps,
          as: "users_calendars",
          attributes: [],
        },
      ],
    });

    list = await Promise.all(
      list.map(async (calendar) => {
        calendar.dataValues.members = await calendarModel.getCalendarMembers(
          calendar.id
        );
        return calendar;
      })
    );

    return list;
  }

  async getEventMember(authorId, eventId) {
    return await this.table.findAll({
      raw: true,
      attributes: [
        ["id", "user_id"],
        "users_calendars.user_role",
        "users_calendars->calendar->events_calendars->event.author_id",
        "users_calendars->calendar->events_calendars->event.id",
      ], // , "users_calendars.calendar.events_calendars.event.author_id"
      where: { id: authorId },
      include: [
        {
          model: users_calendars,
          as: "users_calendars",
          attributes: [],
          raw: true,
          include: {
            model: calendars,
            as: "calendar",
            attributes: [],
            raw: true,
            include: {
              model: events_calendars,
              as: "events_calendars",
              where: { event_id: eventId },
              attributes: [],
              raw: true,
              include: {
                model: events,
                where: { id: eventId },
                as: "event",
                attributes: [],
                raw: true,
              },
            },
          },
        },
      ],
    });
  }

  async checkEventAdminPermission(authorId, eventId) {
    const data = await this.getEventMember(authorId, eventId);
    console.log(data);
    if (!data || data.length == 0 || data[0].id == null) {
      return false;
    }

    if (data[0].user_role == "assignee" || data[0].author_id == authorId) {
      return true;
    }

    return false;
  }

  async checkEventViewPermission(authorId, eventId) {
    const data = await this.getEventMember(authorId, eventId);
    console.log(data);
    if (!data || data.length == 0 || data[0].id == null) {
      return false;
    }

    return true;
  }

  async findByUniqueKey(key, without = []) {
    without = without.map((val) => val.id);
    return await this.table.findAll({
      where: {
        [Op.or]: [
          {
            login: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + key + "%",
            },
          },
        ],
        id: {
          [Op.notIn]: without,
        },
      },
    });
  }
}

module.exports = Users;
