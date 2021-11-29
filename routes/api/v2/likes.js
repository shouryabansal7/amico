const express = require("express");

const passport = require("passport");
const router = express.Router();
const likesApi = require("../../../controllers/api/v2/likes_api");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  likesApi.index
);

router.post(
  "/toggle",
  passport.authenticate("jwt", { session: false }),
  likesApi.toggle
);

module.exports = router;
