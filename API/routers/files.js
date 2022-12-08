const path = require("path");

const router = require("express").Router();

router.get("/profile_pictures/:filename", (req, res) =>
  res.sendFile(
    path.resolve("user_files", "profile_pictures", req.params.filename)
  )
);

module.exports = router;
