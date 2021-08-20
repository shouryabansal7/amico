const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendship_controller');

//to take profile_user id as input
router.get('/friends/:id',friendController.Friends);
module.exports = router;