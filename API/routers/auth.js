const controller = require("../controllers/auth");

const router = require("express").Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/password-reset", controller.passwordReset);
router.post("/password-reset/:confirmToken", controller.confirmNewPassword);
router.get("/confirm/:confirmToken", controller.confirmEmail);
router.get("/me", controller.getMe);
router.post("/checkToken/:token", controller.checkToken);

module.exports = router;
