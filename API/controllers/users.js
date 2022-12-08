var wc = require("which-country");
const fetch = require("node-fetch");
const { GEONAMES_USERNAME, HOLIDAY_API_KEY } = require("../config.json");
const users = new (require("../models/users"))();
const regions = require("../global/regions");
const hashPassword = require("../utils/hashPassword");
const Resize = require("../utils/resize");
const path = require("path");

module.exports = {
  async setLocation(req, res) {
    try {
      if (!req.body.latitude || !req.body.longitude) {
        return res.sendStatus(400);
      }
      const url = `http://api.geonames.org/countryCodeJSON?lat=${req.body.latitude}&lng=${req.body.longitude}&username=${GEONAMES_USERNAME}`;
      let geoRes = await (await fetch(url)).json();
      await users.save({ id: req.user.id, country: geoRes.countryCode });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  async getHoliday(req, res) {
    try {
      const BASE_CALENDAR_URL =
        "https://www.googleapis.com/calendar/v3/calendars";
      const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY =
        "holiday@group.v.calendar.google.com";
      const API_KEY = HOLIDAY_API_KEY;

      const { country } = await users.find({ id: req.user.id });
      const CALENDAR_REGION = `en.${regions[country.toLowerCase()]}`;
      console.log(req.query);
      const { year, month, day } = req.query;
      const datetime = new Date(Date.UTC(year, month, day));
      // `${year}-${+month+1}-${+day < 10 ? '0'+day : day}`
      // console.log(datetime);
      const timeMin = datetime.toISOString();
      datetime.setUTCHours(23, 59, 59);
      const timeMax = datetime.toISOString();

      // console.log({timeMin,timeMax});

      const url = `${BASE_CALENDAR_URL}/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data && data.items.length != 0) {
        let name = data.items[0].summary.split("(Suspended)")[0];

        res.json({ name });
      } else {
        res.json({});
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  async getUsers(req, res) {
    try {
      console.log("get users");
      const key = req.query["unique-key"];
      let without  = req.query.without;
      if(without) {
        without = JSON.parse(without);
      }
      let usersList = await users.findByUniqueKey(key, without);
      res.json(usersList);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const data = req.body;
      console.log("update user", data);
      if (data.email || data.id || data.default_calendar_id) {
        res.sendStatus(400);
        return;
      }

      if (data.login) {
        const exists = await users.find({ login: data.login });
        if (!Array.isArray(exists)) {
          res.status(400).json("Login already in use");
          return;
        }
      }

      if (data.password) {
        data.password = hashPassword(data.password);
      }

      await users.save({ id: req.user.id, ...data });
      let savedUser = await users.find({ id: req.user.id });
      res.status(200).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async setUserAvatar(req, res) {
    try {
      const user = req.user;
      const imagePath = path.join(__dirname, "../user_files/profile_pictures");
      const fileUpload = new Resize(imagePath);
      // console.log("image", req);
      if (!req.file) {
        res.status(401).json({ error: "Please provide an image" });
      }
      await fileUpload.save(req.file.buffer, user.login + ".png");
      await users.save({
        id: user.id,
        profile_picture: "profile_pictures/" + user.login + ".png",
      });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
