const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comment_controller');

router.post('/create',passport.checkAuthenticity,commentsController.create);
router.get('/destroy/:id',passport.checkAuthenticity,commentsController.destroy);

module.exports = router;