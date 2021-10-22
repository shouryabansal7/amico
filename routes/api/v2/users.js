const express = require("express");

const router = express.Router();
const usersApi = require("../../../controllers/api/v2/users_api");

router.post("/create-session", usersApi.createSession);
router.post("/create", usersApi.create);

module.exports = router;
