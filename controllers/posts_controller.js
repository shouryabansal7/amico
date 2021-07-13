const Post = require('../models/posts');
const Comment = require('../models/comment');

module.exports.create = function(req,res){
    Post.create({
        content : req.body.content,
        user : req.user._id
    },
    function(err,post){
        if(err){
            console.log('error in creating the post');
            return;
        }

        return res.redirect('back');
    });
}

module.exports.destroy = function(req,res){
    //before deleting a post, find whether the post exist or not
    Post.findById(req.params.id,function(err,post){
        //if the user authorised to delete the post
        //.id means converting the object id to string
        if(post.user==req.user.id){
            post.remove();
            Comment.deleteMany({post:req.params.id},function(err){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });
}