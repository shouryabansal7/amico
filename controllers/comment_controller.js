const Comment = require('../models/comment');

const Post = require('../models/posts');

module.exports.create = function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(err){
            console.log('comment not created 1');
            return;
        }
        if(post){
            Comment.create({
                content : req.body.content,
                post : req.body.post,
                user : req.user._id
            },function(err,comment){
                if(err){
                    console.log('comment not created 2');
                    return;
                }

                post.comments.push(comment);
                post.save();
                return res.redirect('/');
            });
        }
    });
}