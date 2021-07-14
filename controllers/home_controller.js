const Post = require('../models/posts');
const User = require('../models/users');

module.exports.home = function(req,res){
    // to display posts
    /*Post.find({},function(err,posts){
            return res.render('home',{
            title: 'Amico | Home',
            posts: posts
        });
    });*/
   
   /* return res.render('home',{
        title: 'Home'
    });*/

    //to display posts along wiht the user's name who made the post
    /*Post.find({}).populate('user').exec(function(err,posts){
            return res.render('home',{
            title: 'Amico | Home',
            posts: posts
        });
    });*/

    //to display posts and comments
    Post.find({})
    .populate('user')
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    })
    .exec(function(err,posts){
        User.find({},function(err,users){
            return res.render('home',{
                title : 'Amico | Home',
                posts : posts,
                all_users : users
            });
        });
    });
};