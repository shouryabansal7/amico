const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
function(email, password, done){
    //find a user and establish identity
    User.findOne({email : email}, function(err,user){
        if(err){
            console.log('Error in finding user --> Passport');
            return;
        }

        //if user not found or password entered by the user is wrong
        if(!user||user.password!=password){
            console.log('Invalid Username/Password');
            return done(null,false);
        }

        return done(null,user);
    });
}
));

//serialising to user to decide which key is to be kept in cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//desearializing the user from the key in the cookie
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        if(err){
            console.log('Error in finding user --> passport');
            return done(err);
        }
        return done(null,user);
    });
});

//check if the user is authenticated
passport.checkAuthenticity = function(req,res,next){
    //if the user is signed in, then pass request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the view
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;