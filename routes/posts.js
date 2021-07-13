const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

router.post('/create',passport.checkAuthenticity,postsController.create);
router.get('/destroy/:id',passport.checkAuthenticity,postsController.destroy);

module.exports = router;