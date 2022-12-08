const {
  generateConfirmToken,
  authenticateConfirmToken,
} = require("../utils/token");
const sendLetter = require("../utils/nodemailer");
const events = new (require("../models/events"))();
const users = new (require("../models/users"))();
const events_calendars = new (require("../models/events_calendars"))();
const config = require("../config.json");

module.exports = {
  async getEvent(req, res) {
    let { eventId } = req.params;
    if (isNaN(parseInt(eventId))) {
      res.sendStatus(400);
      return;
    }

    const access = await users.checkEventViewPermission(req.user.id, eventId);
    if (!access) {
      res.sendStatus(403);
      return;
    }

    const event = await events.find({ id: eventId });

    res.json(event);
  },

  async inviteUser(req, res) {
    let { eventId } = req.params;
    if (isNaN(parseInt(eventId))) {
      res.sendStatus(400);
      return;
    }

    const access = await users.checkEventAdminPermission(req.user.id, eventId);
    if (!access) {
      res.sendStatus(403);
      return;
    }

    let data = req.body;
    if (!data.members) {
      res.sendStatus(400);
      return;
    }
    const event = await events.find({ id: eventId });

    for (const member of data.members) {
      const user = await users.find({ id: member.id });
      console.log(user);
      let confirmToken = generateConfirmToken({
        id: user.id,
        defaultCalendar: user.default_calendar_id,
        email: user.email,
        login: user.login,
        event_id: eventId,
      });
      const link = `http://localhost:${config.port}/api/events/confirm/${confirmToken}`;
      const message = `Your invite link: ${link}`;
      sendLetter(user.email, event.title, message);
    }

    res.sendStatus(200);
  },

  async confirmInviteUser(req, res) {
    const { confirmToken } = req.params;
    let data = authenticateConfirmToken(confirmToken);
    if (!confirmToken || !data) {
      res.sendStatus(403);
      return;
    }
    delete data.iat;
    delete data.exp;

    let exists = await events_calendars.find({
      event_id: data.event_id,
      calendar_id: data.defaultCalendar,
    });
    if (exists.length != 0) {
      res.status(403).json({
        status: 403,
        message: "already invited to the event",
      });
      return;
    }

    await events_calendars.save({
      event_id: data.event_id,
      calendar_id: data.defaultCalendar,
    });
    res.sendStatus(200);
  },

  async updateEvent(req, res) {
    let { eventId } = req.params;
    if (isNaN(parseInt(eventId))) {
      res.sendStatus(400);
      return;
    }

    const isAuthor =
      (await events.find({ id: eventId }))?.author_id == req.user.id;
    if (!isAuthor) {
      res.sendStatus(403);
      return;
    }

    let data = req.body;
    data.id = eventId;
    let newEvent = await events.save(data);
    if (!newEvent) {
      res.status(500).json(newEvent);
      return;
    }
    console.log(data);
    res.sendStatus(200);
  },

  async deleteEvent(req, res) {
    let { eventId } = req.params;
    if (isNaN(parseInt(eventId))) {
      res.sendStatus(400);
      return;
    }
    const event = await events.find({ id: eventId });
    const user = await users.find({ id: req.user.id });
    console.log(event);
    const isAuthor = event.author_id == user.id;
    if (!isAuthor) {
      await events_calendars.delete({
        event_id: eventId,
        calendar_id: user.default_calendar_id,
      });
    } else {
      await events.delete({ id: eventId });
    }

    res.sendStatus(200);
  },
};
