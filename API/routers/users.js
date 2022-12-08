const { authenticateToken } = require("../utils/token");
const controller = require("../controllers/users");
const uploadImage = require("../utils/uploadImage");

const router = require("express").Router();

router.post("/location", authenticateToken, controller.setLocation);
router.get("/holiday", authenticateToken, controller.getHoliday);
router.get("/", authenticateToken, controller.getUsers);
router.patch("/", authenticateToken, controller.updateUser);
router.post(
  "/avatar",
  authenticateToken,
  uploadImage.single("image"),
  controller.setUserAvatar
);

module.exports = router;
