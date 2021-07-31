const Post = require('../models/posts');
const User = require('../models/users');

module.exports.home = async function(req,res){
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
    try{
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path : 'comments',
            populate : {
                path : 'user'
            }
        });

        let users = await User.find({});

        return res.render('home',{
            title : 'Amico | Home',
            posts : posts,
            all_users : users
        });
    }catch(err){
        console.log(err);
        return;
    }
};