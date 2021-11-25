const express = require("express");
const passport = require("passport");

const router = express.Router();
const usersApi = require("../../../controllers/api/v2/users_api");

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  usersApi.profile
);
router.post("/create-session", usersApi.createSession);
router.post("/create", usersApi.create);

module.exports = router;
