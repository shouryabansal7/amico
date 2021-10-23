const express = require("express");

const passport = require("passport");
const router = express.Router();
const friendsApi = require("../../../controllers/api/v2/friends_api");

router.get(
  "/fetch_user_friends",
  passport.authenticate("jwt", { session: false }),
  friendsApi.index
);

module.exports = router;
