const User = require('../models/users');
const fs = require('fs');
const path = require('path');
const Friendship = require('../models/friendship');

module.exports.profile = async function(req,res){
    try{
        let user = await User.findById(req.params.id);
        //checking if friendship already exists between them or not
        let existing = await Friendship.findOne({
            from_user: req.user._id,
            to_user: req.params.id
        });
        let status;
        if(existing){
            status = "Remove Friend";
        }else{
            status = "Add Friend";
        }
        return res.render('user_profile',{
            title : 'User Profile',
            profile_user : user,
            friendStatus : status
        });
    }catch(err){
        return res.redirect('back');
    }
};

module.exports.post = function(req,res){
    return res.end('<h1>No Post Till Yet</h1>');
};

module.exports.SignIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "Amico | Sign In"
    });
};

module.exports.SignUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
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
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/');
}

module.exports.update = async function(req,res){
    /*if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body,function(err,user){
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('unauthorised');
    }*/
    if(req.user.id == req.params.id){
        try{
            let user = await User.findByIdAndUpdate(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('****Multer error :',err);
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    //check if there is already a path user.avatar for the profile picture present before updating the pic
                    //also check if a picture is present at that path
                    //if yes then remove that path form database
                    if(user.avatar && fs.existsSync(path.join(__dirname,'..',user.avatar))){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    //saving the path of the uploaded file into the avatar field in the user database
                    user.avatar = User.avatarPath+'/'+req.file.filename; 
                }
                user.save();
                
                return res.redirect('back');
            });
        }catch(err){
            return res.redirect('back');
        }
    }else{
        return res.status(401).send('unauthorised');
    }
}