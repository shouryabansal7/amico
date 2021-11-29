const express = require("express");

const router = express.Router();
const commentsApi = require("./../../../controllers/api/v2/comments_api");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentsApi.list
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentsApi.create
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentsApi.destroy
);

module.exports = router;
