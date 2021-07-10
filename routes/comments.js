const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comment_controller');

router.post('/create',passport.checkAuthenticity,commentsController.create);

module.exports = router;