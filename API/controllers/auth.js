const {
  generateConfirmToken,
  authenticateConfirmToken,
  generateAccessToken,
  authenticateLoginToken,
} = require("../utils/token");
const hashPassword = require("../utils/hashPassword");
const { validateRegisterData } = require("../utils/validateAuth");
const users = new (require("../models/users"))();
const calendars = new (require("../models/calendars"))();
const users_calendars = new (require("../models/users_calendars"))();
const sendLetter = require("../utils/nodemailer");
const config = require("../config.json");

async function newCalendar(userId) {
  const calendar = {
    title: "Default",
    create_date: new Date(),
    author_id: userId,
  };

  const savedCalendar = await calendars.save(calendar);
  await users_calendars.save({
    user_id: userId,
    calendar_id: savedCalendar.id,
    user_role: "assignee",
  });
  await users.save({ id: userId, default_calendar_id: savedCalendar.id });
}

module.exports = {
  async register(req, res) {
    let data = req.body;
    let err = validateRegisterData(data);

    if (err) {
      return res.status(400).json({ message: "Validation error" });
    }
    if ((await users.find({ login: data.login })).length != 0) {
      return res.status(409).json({ message: "Such login already exists" });
    }
    if (
      (await users.find({ email: data.email })).length != 0 ||
      (await users.find({ email: "unconfirmed@" + data.email })).length != 0
    ) {
      return res.status(409).json({ message: "Such email already exists" });
    }

    if ((!req.user || req.user.role !== "admin") && data.role === "admin") {
      return res.sendStatus(403);
    }
    const email = data.email;
    data.email = `unconfirmed@${email}`;
    const id = (await users.save(data)).id;
    await newCalendar(id);

    let confirmToken = generateConfirmToken({ id, email, login: data.login });

    const link = `http://localhost:3000/confirm/${confirmToken}`;

    let message = `
    <h2 style='font-size: 30px; font-family: Verdana , sans-serif; font-weight: 800; color:#3D405B'>weekly.</h2><br>
    <h1 style='font-size: 26px; font-family: Verdana;'>Email Confirmation</h1>
    <p>We just need one small favor from you - please confirm your email to continue.</p><br><br>
    <a href='${link}' target='_blank' style='outline:none; background-color:#3D405B; font-size: 16px; color: #fff;
    border: none; padding: 10px 40px; border-radius: 10px; margin: 10px 0;'>Confirm</a><br><br>
    <p>If the button don't work <a target='_blank' href='${link}'>Click here</a>.</p>
    `;
    sendLetter(email, "Confirm email", message);

    res.sendStatus(200);
  },

  async login(req, res) {
    console.log("login");
    let data = req.body;
    if (data.token && (await authenticateLoginToken(data.token))) {
      res.cookie("token", data.token);
      return res.sendStatus(200).send("Already authorized");
    }
    if ((!data.login && !data.email) || !data.password) {
      return res.sendStatus(400);
    }

    data.password = hashPassword(data.password);
    let userData = await users.find({
      login: data.login,
      password: data.password,
    });
    if (userData.length == 0) {
      return res.status(401).json({ error: "Login or password is incorrect" });
    }
    if (userData.email.match(/unconfirmed@([^\s]+)@([^\s^.]+).([^\s]+)/gm)) {
      return res
        .status(403)
        .json({ error: "Please, confirm your email address" });
    }

    const token = generateAccessToken({
      login: userData.login,
      full_name: userData.full_name,
      id: userData.id,
      role: userData.role,
    });
    res.cookie("token", token);
    res.status(200).json(userData);
  },

  logout(req, res) {
    if (!req.cookies.token) {
      return res.sendStatus(401);
    }
    res.clearCookie("token");
    res.sendStatus(204);
  },

  async passwordReset(req, res) {
    let data = req.body;
    if (!data.email) {
      return res.status(400).json({ error: "No email" });
    }
    if ((await users.find({ email: data.email })).length == 0) {
      return res
        .status(404)
        .json({ error: "There is no account associated with this email" });
    }

    let confirmToken = generateConfirmToken({ email: data.email });

    const link = `http://localhost:3000/reset-password/${confirmToken}`;

    let message = `
    <h2 style='font-size: 30px; font-family: Verdana , sans-serif; font-weight: 800; color:#3D405B'>weekly.</h2><br>
    <h1 style='font-size: 26px; font-family: Verdana;'>Password Reset</h1>
    <p style='font-family: Verdana; '>Hello, ${req.body.email}. We have received a request to reset the password for your account.
    No changes have been made for your account yet. <b>If you did not request a password reset, ignore this message</b></p><br/>
    <p style='font-family: Verdana;'>Tap on the button to change password</p><br/>
    <a href='${link}' target='_blank' style='outline:none; background-color:#3D405B; font-size: 16px; color: #fff;
    border: none; padding: 10px 40px; border-radius: 10px; margin: 10px 0;'>Reset password</a><br><br>
    <p>If the button don't work <a target='_blank' href='${link}'>Click here</a>.</p>
    `;
    sendLetter(data.email, "Password Reset", message);

    res.sendStatus(200);
  },

  async confirmEmail(req, res) {
    try {
      let token = req.params.confirmToken;
      let data = authenticateConfirmToken(token);
      if (!token || !data) {
        return res
          .status(403)
          .json({ error: "This link is no longer reachable" });
      }
      delete data.iat;
      delete data.exp;

      await users.save(data);
      res.status(200).send("Email has been successfully confirmed");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
  },

  async confirmNewPassword(req, res) {
    let newPassword = req.body.password;
    if (!newPassword || newPassword.length < 8) {
      console.log(newPassword.length);
      return res.status(400).json({ error: "Password is short" });
    }

    let token = req.params.confirmToken;
    let data = authenticateConfirmToken(token);
    console.log(data);

    if (!token || !data) {
      return res.status(400).send("Link is no longer reachable");
    }
    let userData = await users.find({ email: data.email });

    userData.password = hashPassword(newPassword);
    if ((await users.save(userData)) == -1) {
      return res.status(400);
    }
    return res.status(200);
  },

  async getMe(req, res) {
    try {
      const info = await authenticateLoginToken(req.cookies.token);
      if (!info) {
        res.clearCookie("token");
        return res.status(401).send("Access denied");
      }
      const user = await users.find({ id: info.id });

      if (!user) {
        return res.status(404).send("User has not been found");
      }

      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Access denied");
    }
  },

  async checkToken(req, res) {
    try {
      let token = req.params.token;
      let data = authenticateConfirmToken(token);

      if (!token || !data) {
        return res.status(400).send("This link is no longer reachable");
      }

      return res.status(200);
    } catch (err) {
      return res.status(500).send("Some error happened");
    }
  },
};
