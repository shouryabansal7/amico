const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_constroller');

router.get('/profile',userController.profile);
router.get('/post',userController.post);
router.get('/sign-up',userController.SignUp);
router.get('/sign-in',userController.SignIn);

router.post('/create',userController.create);
router.post('/create-session',userController.createSession);

module.exports = router;