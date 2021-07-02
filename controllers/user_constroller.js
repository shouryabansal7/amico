const User = require('../models/users');
module.exports.profile = function(req,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id,function(err,user){
            if(user){
                return res.render('user_profile',{
                    title: 'User Profile',
                    user: user
                });
            }else{
                return res.redirect('/users/sign-in');
            }
        });
    }else{
        return res.redirect('/users/sign-in');
    }
};

module.exports.post = function(req,res){
    return res.end('<h1>No Post Till Yet</h1>');
};

module.exports.SignIn = function(req,res){
    return res.render('user_sign_in',{
        title: "Amico | Sign In"
    });
};

module.exports.SignUp = function(req,res){
    return res.render('user_sign_up',{
        title: "Amico | Sign Up"
    });
};

//get the sign up data
module.exports.create = function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('error in finding user in signing up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('error is creating the user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('back');
        }
    });
}

//to Sign In
module.exports.createSession = function(req,res){
    //Steps to authenticate
    //find user
    User.findOne({email: req.body.email}, function(err,user){
        if(err){
            console.log('error in finding user in signing in');
            return;
        }
        //handle the user
        if(user){
            //handle password which doesn't match
            if(user.password!=req.body.password){
                return res.redirect('back');
            }
            //handle the session creation
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');
        }else{
            //handle the user not found
            return res.redirect('back');
        }
    });
}

module.exports.endSession = function(req,res){
    res.clearCookie('user_id');
    return res.redirect('/users/sign-in');
}