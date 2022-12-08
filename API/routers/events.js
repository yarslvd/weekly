const { authenticateToken } = require("../utils/token");
const controller = require("../controllers/events");

const router = require("express").Router();

// router.get('/', authenticateToken, controller.getCalendarsList);
// router.post('/', authenticateToken, controller.newCalendar);
router
  .route("/:eventId")
  .get(authenticateToken, controller.getEvent)
  .post(authenticateToken, controller.inviteUser)
  .patch(authenticateToken, controller.updateEvent)
  .delete(authenticateToken, controller.deleteEvent);
router.get("/confirm/:confirmToken", controller.confirmInviteUser);

module.exports = router;
