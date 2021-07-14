const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user_constroller');

router.get('/profile/:id',passport.checkAuthenticity,userController.profile);
router.get('/post',userController.post);
router.get('/sign-up',userController.SignUp);
router.get('/sign-in',userController.SignIn);

router.post('/create',userController.create);
//use passport middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/users/sign-in'}
),userController.createSession);

router.get('/sign-out',userController.destroySession);
router.post('/update/:id',passport.checkAuthenticity,userController.update);

module.exports = router;