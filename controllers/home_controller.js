const Post = require('../models/posts');

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
    Post.find({}).populate('user').exec(function(err,posts){
            return res.render('home',{
            title: 'Amico | Home',
            posts: posts
        });
    });
};